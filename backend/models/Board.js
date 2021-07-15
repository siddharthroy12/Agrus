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
	logo: {
		type:String,
		default: '',
	},
	description: {
		type: String,
		required: true,
	},
	members: {
		type: Number,
		default: 0
	},
}, {
    timestamp: true
})

module.exports = Board = mongoose.model('Board', boardSchema)