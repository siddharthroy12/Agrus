const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = mongoose.Schema({
	username: {
		type: String,
		required: true
	},
	password: {
		type: String,
		require: true
	},
	avatar: {
		type: String,
		default: ''
	},
	joinedBoards: [{
		type: mongoose.Schema.ObjectId,
		ref: 'Board'
	}],
	savedPosts: [{
		type: mongoose.Schema.ObjectId,
		ref: 'Post'
	}],
	posts: [{
		type: mongoose.Schema.ObjectId,
		ref: 'Post'
	}],
	comments: [{
		type: mongoose.Schema.ObjectId,
		ref: 'Post'
	}],
	upvotedPosts: [{
		type: mongoose.Schema.ObjectId,
		ref: 'Post'
	}],
	downvotedPosts: [{
		type: mongoose.Schema.ObjectId,
		ref: 'Post'
	}],
	upvotedComments: [{
		type: mongoose.Schema.ObjectId,
		ref: 'Comment'
	}],
	downvotedComments: [{
		type: mongoose.Schema.ObjectId,
		ref: 'Comment'
	}],
	joinedBoards: [{
		type: mongoose.Schema.ObjectId,
		ref: 'Board'
	}],
	isAdmin: {
    type: Boolean,
    default: false
  },
	disabled: {
		type: Boolean,
		default: false,
	}
}, {
    timestamp: true
})

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next()
  } else {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
  }
})

userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

module.exports = User = mongoose.model('User',userSchema)