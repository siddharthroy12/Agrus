const asyncHandler = require('express-async-handler')
const Post = require('../models/Post')
const Board = require('../models/Board')
const { listeners } = require('../models/Post')

// @desc Create a post
// @route POST /api/post
// @access Private
const createPost = asyncHandler(async (req, res) => {
	const { title, board, type, body, media } = req.body

	// Title and type is always required, others depends on type
	if (title === undefined || type === undefined) {
		res.status(400)
		throw new Error('Title and type is required')
	}

	if (title.trim() === '') {
		res.status(400)
		throw new Error('Title cannot be empty')
	}

	// If post is on board then check if the board exists
	if (board !== undefined && board.trim() !== '') {
		const boardExist = await Board.findOne({boardName: board})
		if (!boardExist) {
			res.status(400)
			throw Error('Board do not exist')
		}
	}

	let newPost = {}

	try {
		switch(type) {
			case 'text':
				// If type is text then body is required	
				if (body === undefined) {
					res.status(400)
					throw Error("Where's the body?1!")
				}
				if (body.trim() === '') {
					res.status(400)
					throw Error("Body can't be empty")
				}

				newPost = {
					body,
				}
				break

			case 'image':
			case 'video':
				// If type is image then meida is required
				if (media === undefined) {
					res.status(400)
					throw Error("Where's the media?1!")
				}
				if (media.trim() === '') {
					res.status(400)
					throw Error("Media can't be empty")
				}

				newPost = {
					media,
				}
				break

			default:
				throw new Error('Invalid type')
		}
	} catch(error) {
		throw new Error(err.message)
	}

	newPost = {
		...newPost,
		author: req.user.username,
		title,
		type,
		board: board === undefined ? '' : board
	}

	const newCreatedPost = await Post.create(newPost)

	res.status(201)
	res.json(newCreatedPost)
})

// @desc Get a post
// @route Get /api/post/:id
// @access Public
const getPost = asyncHandler(async (req, res) => {
	if (!(req.params.id.match(/^[0-9a-fA-F]{24}$/))) {
		res.status(400)
		throw Error('Not valid id')	
	}

	const post = await Post.findById(req.params.id)

	if (!post) {
		res.status(404)
		throw new Error('Post not found')
	}

	res.status(200)
	res.json(post)
})

// @desc Get feed
// @route Get /api/post/feed/get?page=1&perpage=2
// @access Public
const getPostFeed = asyncHandler(async (req, res) => {
	const { page, perpage } = req.query

	if (page === undefined || perpage === undefined) {
		res.status(400)
		throw new Error('Provide page and perpage')
	}

	var query = await Post.find({}).sort({ createdAt: -1 }).skip((page-1) * perpage).limit(perpage * 1)

	res.status(200)
	res.json(query)
})

// @desc Edit a post
// @route PUT /api/post/:id
// @access Private
const editPost = asyncHandler(async (req, res) => {
	if (!(req.params.id.match(/^[0-9a-fA-F]{24}$/))) {
		res.status(400)
		throw Error('Not valid id')	
	}

	const post = await Post.findById(req.params.id)

	if (!post) {
		res.status(404)
		throw new Error('Post not found')
	}

	if (post.author.toString() !== req.user._id.toString() && req.user.isAdmin === false) {
		res.status(403)
		throw new Error("It's not your post buddy")
	}

	let { title, body } = req.body

	if (title !== undefined) {
		if (title.trim() === '') {
			res.status(400)
			throw new Error("Title can't be empty")
		}
	}

	switch(post.type) {
		case 'text':
			if (body !== undefined) {
				if (body.trim() === '') {
					res.status(400)
					throw new Error("Title can't be empty")
				}
			}
			break;

		case 'image':
		case 'video':
			if (body !== undefined) { // Becase body should be empty for media post
				body = ''
			}
	}

	post.title = title
	post.body = body

	await post.save()

	res.status(200)
	res.json(post)
})

// @desc Upvote a post
// @route POST /api/post/:id/upvote
// @access Private
const upvotePost = asyncHandler(async (req, res) => {
	if (!(req.params.id.match(/^[0-9a-fA-F]{24}$/))) {
		res.status(400)
		throw Error('Not valid id')	
	}

	const post = await Post.findById(req.params.id)

	if (!post) {
		res.status(404)
		throw new Error('Post not found')
	}

	const isUpvoted = req.user.upvotedPosts.filter(postId => {
		return postId.toString() === post._id.toString()
	}).length

	if (isUpvoted) {
		req.user.upvotedPosts = req.user.upvotedPosts.filter(postId => {
			return postId.toString() !== post._id.toString()
		})

		await Post.updateOne({_id: req.params.id}, {
			$inc: {
				score: -1
			}
		})

		await req.user.save()

		res.status(200)
		res.json({message: 'Post un-upvoted'})
	} else {
		const isDownvoted = req.user.downvotedPosts.filter(postId => {
			return postId.toString() === post._id.toString()
		}).length

		if (isDownvoted) {
			req.user.downvotedPosts = req.user.downvotedPosts.filter(postId => {
				return postId.toString() !== post._id.toString()
			})
		}

		req.user.upvotedPosts.push(post._id)
		await req.user.save()

		await Post.updateOne({_id: req.params.id}, {
			$inc: {
				score: isDownvoted ? 2 : 1
			}
		})

		res.status(200)
		res.json({message: 'Post upvoted'})
	}
})

// @desc Downvote a post
// @route POST /api/post/:id/downvote
// @access Private
const downvotePost = asyncHandler(async (req, res) => {
	if (!(req.params.id.match(/^[0-9a-fA-F]{24}$/))) {
		res.status(400)
		throw Error('Not valid id')	
	}

	const post = await Post.findById(req.params.id)

	if (!post) {
		res.status(404)
		throw new Error('Post not found')
	}

	const isDownvoted = req.user.downvotedPosts.filter(postId => {
		return postId.toString() === post._id.toString()
	}).length

	if (isDownvoted) {
		req.user.downvotedPosts = req.user.downvotedPosts.filter(postId => {
			return postId.toString() !== post._id.toString()
		})

		await Post.updateOne({_id: req.params.id}, {
			$inc: {
				score: 1
			}
		})

		await req.user.save()

		res.status(200)
		res.json({message: 'Post un-downvoted'})
	} else {
		const isUpvoted = req.user.upvotedPosts.filter(postId => {
			return postId.toString() === post._id.toString()
		}).length

		if (isUpvoted) {
			req.user.upvotedPosts = req.user.upvotedPosts.filter(postId => {
				return postId.toString() !== post._id.toString()
			})
		}

		req.user.downvotedPosts.push(post._id)
		await req.user.save()

		await Post.updateOne({_id: req.params.id}, {
			$inc: {
				score: isUpvoted ? -2 : -1
			}
		})

		res.status(200)
		res.json({message: 'Post downvoted'})
	}
})


// @desc Save and unsave a post
// @route POST /api/post/:id/save
// @access Private
const savePost = asyncHandler(async (req, res) => {
	if (!(req.params.id.match(/^[0-9a-fA-F]{24}$/))) {
		res.status(400)
		throw Error('Not valid id')	
	}

	const post = await Post.findById(req.params.id)

	if (!post) {
		res.status(404)
		throw new Error('Post not found')
	}

	const isSaved = req.user.savedPosts.filter(postId => {
		return postId.toString() === post._id.toString()
	}).length

	if (isSaved) {
		req.user.savedPosts = req.user.savedPosts.filter(postId => {
			return postId.toString() !== post._id.toString()
		})
		await req.user.save()

		res.status(200)
		res.json({message: 'Post unsaved'})
	} else {
		req.user.savedPosts.push(post._id)
		await req.user.save()

		res.status(200)
		res.json({message: 'Post saved'})
	}
})


// @desc Delete a post
// @route DELETE /api/post/:id
// @access Private
const deletePost = asyncHandler(async (req, res) => {
	if (!(req.params.id.match(/^[0-9a-fA-F]{24}$/))) {
		res.status(400)
		throw Error('Not valid id')	
	}

	const post = await Post.findById(req.params.id)

	if (!post) {
		res.status(404)
		throw new Error('Post not found')
	}

	if (post.author.toString() !== req.user._id.toString() && req.user.isAdmin === false) {
		res.status(403)
		throw new Error("It's not your post buddy")
	}

 	await post.remove()
	res.status(200)

	res.json({message: 'Post deleted'})

})

// @desc Get All Posts
// @route GET /api/post/
// @access Public/Development
const getAllPosts = asyncHandler(async (req, res) => {
	if (process.env.NODE_ENV === 'development') {
		const posts = await Post.find({})
		res.status(200)
		res.json(posts)
	} else {
		res.status(400)
		throw new Error('Not permitted')
	}
})


module.exports = {
  createPost,
	getPost,
	getPostFeed,
	editPost,
	upvotePost,
	downvotePost,
	savePost,
	getAllPosts,
	deletePost,
}