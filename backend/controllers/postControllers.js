const asyncHandler = require('express-async-handler')
const Post = require('../models/Post')

// @desc Create a post
// @route POST /api/post
// @access Private
const createPost = asyncHandler(async (req, res) => {
	const { title, board, type, body, media, mediaType } = req.body

	if (title === undefined || type === undefined) {
		res.status(400)
		throw new Error('Title and type is required')
	}


	if (title.trim() === '') {
		res.status(400)
		throw new Error('Title cannot be empty')
	}

	if (board !== undefined) {
		if (board.trim() === '') {
			res.status(400)
			throw new Error('Invalid board name')
		} else {
			
		}
	}

	try {
		switch(type) {
			case 'text':

			default:
				throw new Error('Invalid type')
		}
	} catch(error) {
		throw new Error(err.message)
	}

	
	

})

module.exports = {
  
}