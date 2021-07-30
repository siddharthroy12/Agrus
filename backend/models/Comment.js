const mongoose = require('mongoose')

const commentSchema = mongoose.Schema({
	author: {
		type: String,
		required: true
	},
	parentPost: {
		type: mongoose.Schema.ObjectId,
		ref: 'Post',
	},
	parentComment: {
		type: mongoose.Schema.ObjectId,
		ref: 'Comment',
	},
	body: {
		type: String,
		required: true,
	},
	score: {
		type: Number,
		required: true,
		default: 0
	},
	comments: [{
		type: mongoose.Schema.ObjectId,
		ref: 'Comment',
	}]
}, {
    timestamps: true
})

module.exports = Comment = mongoose.model('Comment', commentSchema)