const asyncHandler = require('express-async-handler')
const Post = require('../models/Post')
const Board = require('../models/Board')

// @desc Create a post
// @route POST /api/post
// @access Private
const createPost = asyncHandler(async (req, res) => {
	const { title, board, type, body, media } = req.body

	if (title === undefined || type === undefined) {
		res.status(400)
		throw new Error('Title and type is required')
	}

	if (title.trim() === '') {
		res.status(400)
		throw new Error('Title cannot be empty')
	}

	if (board !== undefined) {
		const boardExist = await Board.findOne({boardName: board})
		if (!boardExist) {
			res.status(400)
			throw Error('Board do not exist')
		}
	}

	if (type === undefined) {
		res.status(400)
		throw Error("Where's the type?1!")
	}

	try {
		switch(type) {
			case 'text':
				if (body === undefined) {
					res.status(400)
					throw Error("Where's the body?1!")
				}

				if (body.trim() === '') {
					res.status(400)
					throw Error("Body can't be empty")
				}
				const newPost = await Post.create({
					author: req.user._id,
					title,
					body,
					type,
					board: board === undefined ? '' : board
				})
				res.status(201)
				res.json(newPost)
				break

			case 'image':
				if (media === undefined) {
					res.status(400)
					throw Error("Where's the media?1!")
				}

				if (media.trim() === '') {
					res.status(400)
					throw Error("Media can't be empty")
				}
				const newPost = await Post.create({
					author: req.user._id,
					title,
					type,
					media,
					board: board === undefined ? '' : board
				})
				res.status(201)
				res.json(newPost)
				break

			case 'video':
				if (media === undefined) {
					res.status(400)
					throw Error("Where's the media?1!")
				}

				if (media.trim() === '') {
					res.status(400)
					throw Error("Media can't be empty")
				}
				const newPost = await Post.create({
					author: req.user._id,
					title,
					type,
					media,
					board: board === undefined ? '' : board
				})
				res.status(201)
				res.json(newPost)
				break

			default:
				throw new Error('Invalid type')
		}
	} catch(error) {
		throw new Error(err.message)
	}
})

// @desc Get a post
// @route Get /api/post/:id
// @access Public
const getPost = asyncHandler(async (req, res) => {
	const post = await Post.findById(req.params.id)

	if (!post) {
		res.status(404)
		throw new Error('Post not found')
	}

	res.status(200)
	res.json(post)
})

// @desc Get All Posts
// @route GET /api/post/all
// @access Public/Development
const getAllPosts = asyncHandler(async (req, res) => {
	if (process.env.NODE_ENV === 'development') {
		const posts = await Post.find({})
		res.json(posts)
	} else {
		res.status(400)
		throw new Error('Not permitted')
	}
})


module.exports = {
  createPost,
	getPost,
	getAllPosts
}