const mongoose = require('mongoose')

const boardSchema = mongoose.Schema({
	author: {
		type: mongoose.Schema.ObjectId,
		ref: 'User',
		required: true
	},
	boardName: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	members: {
		type: Number,
		required: true,
		default: 0
	},
	posts: [{
		type: mongoose.Schema.ObjectId,
		ref: 'Post'
	}]
}, {
    timestamp: true
})

module.exports = Post = mongoose.model('Board', boardSchema)