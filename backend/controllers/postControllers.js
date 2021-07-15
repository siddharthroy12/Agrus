const asyncHandler = require('express-async-handler')
const Post = require('../models/Post')
const Board = require('../models/Board')

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
	if (board !== undefined) {
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
					author: req.user._id,
					title,
					body,
					type,
					board: board === undefined ? '' : board
				}
				break

			case 'image':
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
					author: req.user._id,
					title,
					type,
					media,
					board: board === undefined ? '' : board
				}
				break

			case 'video':
				// If type is video then meida is required
				if (media === undefined) {
					res.status(400)
					throw Error("Where's the media?1!")
				}
				if (media.trim() === '') {
					res.status(400)
					throw Error("Media can't be empty")
				}
				
				newPost = {
					author: req.user._id,
					title,
					type,
					media,
					board: board === undefined ? '' : board
				}
				break

			default:
				throw new Error('Invalid type')
		}
	} catch(error) {
		throw new Error(err.message)
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

	if (post.owner.toString() !== req.user._id.toString()) {
		res.status(403)
		throw new Error("It's not your post buddy")
	}

 	await post.remove()
	res.status(200)

	res.json({message: 'Post deleted'})

})

// @desc Get All Posts
// @route GET /api/post/all
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
	getAllPosts,
	deletePost,
}