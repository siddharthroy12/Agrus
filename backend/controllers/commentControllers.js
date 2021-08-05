const asyncHandler = require('express-async-handler')
const Post = require('../models/Post')
const Comment = require('../models/Comment')

// @desc Create a comment
// @route POST /api/comment
// @access Private
const createComment = asyncHandler(async (req, res) => {
	const { body, post } = req.body

	if (body.trim() === '' || body === undefined) {
		throw new Error("Comment can't be empty")
	}

	if (post === undefined || post.trim() === '') {
		throw new Error("Can't comment on unkonwn post")
	}

	const postExist = await Post.findById(post)

	if (!postExist) {
		throw new Error("Given post doesn't exist")
	}

	const newComment = await Comment.create({
		author: req.user.username,
		parentPost: post,
		body: body,
	})

	await Post.updateOne({_id: post}, {
		$inc: {
			commentCount: 1
		}
	})

	res.status(200)
	res.json(newComment)

})


// @desc Get get comments of a post
// @route Get /api/comment/feed/:postId?page=1&perpage=2
// @access Public
const getPostComments = asyncHandler(async (req, res) => {
	const { page, perpage } = req.query
	const { postId } = req.params

	if (page === undefined || perpage === undefined) {
		res.status(400)
		throw new Error('Provide page and perpage')
	}

	var query = await Comment.find({ parentPost: postId }).sort({ createdAt: -1 }).skip((page-1) * perpage).limit(perpage * 1)

	res.status(200)
	res.json(query)
})

// @desc Upvote a comment
// @route POST /api/comment/:id/upvote
// @access Private
const upvoteComment = asyncHandler(async (req, res) => {
	if (!(req.params.id.match(/^[0-9a-fA-F]{24}$/))) {
		res.status(400)
		throw Error('Not valid id')	
	}

	const comment = await Comment.findById(req.params.id)

	if (!comment) {
		res.status(404)
		throw new Error('Post not found')
	}

	const isUpvoted = req.user.upvotedComments.filter(commentId => {
		return commentId.toString() === comment._id.toString()
	}).length

	if (isUpvoted) {
		req.user.upvotedComments = req.user.upvotedComments.filter(commentId => {
			return commentId.toString() !== comment._id.toString()
		})

		await Comment.updateOne({_id: req.params.id}, {
			$inc: {
				score: -1
			}
		})

		await req.user.save()

		res.status(200)
		res.json({message: 'Comment un-upvoted'})
	} else {
		const isDownvoted = req.user.downvotedComments.filter(commentId => {
			return commentId.toString() === comment._id.toString()
		}).length

		if (isDownvoted) {
			req.user.downvotedComments = req.user.downvotedComments.filter(commentId => {
				return commentId.toString() !== comment._id.toString()
			})
		}

		req.user.upvotedComments.push(comment._id)
		await req.user.save()

		await Comment.updateOne({_id: req.params.id}, {
			$inc: {
				score: isDownvoted ? 2 : 1
			}
		})

		res.status(200)
		res.json({message: 'Comment upvoted'})
	}
})

// @desc Downvote a comment
// @route POST /api/comment/:id/downvote
// @access Private
const downvoteComment = asyncHandler(async (req, res) => {
	if (!(req.params.id.match(/^[0-9a-fA-F]{24}$/))) {
		res.status(400)
		throw Error('Not valid id')	
	}

	const comment = await Comment.findById(req.params.id)

	if (!comment) {
		res.status(404)
		throw new Error('Post not found')
	}

	const isDownvoted = req.user.downvotedComments.filter(commentId => {
		return commentId.toString() === comment._id.toString()
	}).length

	if (isDownvoted) {
		req.user.downvotedComments = req.user.downvotedComments.filter(commentId => {
			return commentId.toString() !== comment._id.toString()
		})

		await Comment.updateOne({_id: req.params.id}, {
			$inc: {
				score: 1
			}
		})

		await req.user.save()

		res.status(200)
		res.json({message: 'Comment un-downvoted'})
	} else {
		const isUpvoted = req.user.upvotedComments.filter(commentId => {
			return commentId.toString() === comment._id.toString()
		}).length

		if (isUpvoted) {
			req.user.upvotedComments = req.user.upvotedComments.filter(commentId => {
				return commentId.toString() !== comment._id.toString()
			})
		}

		req.user.downvotedComments.push(comment._id)
		await req.user.save()

		await Comment.updateOne({_id: req.params.id}, {
			$inc: {
				score: isUpvoted ? -2 : -1
			}
		})

		res.status(200)
		res.json({message: 'Comment downvoted'})
	}
})

// @desc Delete a comment
// @route DELETE /api/comment/:id
// @access Private
const deleteComment = asyncHandler(async (req, res) => {
	if (!(req.params.id.match(/^[0-9a-fA-F]{24}$/))) {
		res.status(400)
		throw Error('Not valid id')	
	}

	const comment = await Comment.findById(req.params.id)

	if (!comment) {
		res.status(404)
		throw new Error('Post not found')
	}

	if (comment.author.toString() !== req.user.username.toString() && req.user.isAdmin === false) {
		res.status(403)
		throw new Error("It's not your comment buddy")
	}

 	await comment.remove()
	res.status(200)

	res.json({message: 'Comment deleted'})

})



// @desc Get All Comments
// @route GET /api/comment/
// @access Public/Development
const getAllComments = asyncHandler(async (req, res) => {
	if (process.env.NODE_ENV === 'development') {
		const posts = await Comment.find({})
		res.status(200)
		res.json(posts)
	} else {
		res.status(400)
		throw new Error('Not permitted')
	}
})

// TODO make a getComment controller
// TODO make a editComment controller

module.exports = {
	createComment,
	getPostComments,
	upvoteComment,
	downvoteComment,
	deleteComment,
	getAllComments
}