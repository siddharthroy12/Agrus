const mongoose = require('mongoose')

const postSchema = mongoose.Schema({
	author: {
		type: mongoose.Schema.ObjectId,
		ref: 'User',
		required: true
	},
	board: {
		type: mongoose.Schema.ObjectId,
		ref: 'User',
		required: true
	},
	title: {
		type: String,
		required: true,
	},
	type: {
		type: String,
		required: true,
	},
	media: {
		type: String,
	},
	mediaType: {
		type: String,
	},
	body: {
		type: String,
	},
	score: {
		type: Number,
		required: true,
		default: 0
	},
	commentCount: {
		type: Number,
		required: true,
		default: 0 
	},
	comments: {
		type: mongoose.Schema.ObjectId,
		ref: 'Comment',
		required: true
	},
	deleted: {
		type: Boolean,
		required: true,
		default: false
	}
}, {
    timestamp: true
})

module.exports = Post = mongoose.model('Post', postSchema)