const mongoose = require('mongoose')

const postSchema = mongoose.Schema({
	author: {
		type: mongoose.Schema.ObjectId,
		ref: 'User',
		required: true
	},
	board: {
		type: String,
		default: ''
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
		default: ''
	},
	body: {
		type: String,
		default: ''
	},
	score: {
		type: Number,
		default: 0
	},
	commentCount: {
		type: Number,
		default: 0 
	},
	edited: {
		type: Boolean,
		default: false
	}
}, {
    timestamps: true
})

module.exports = Post = mongoose.model('Post', postSchema)