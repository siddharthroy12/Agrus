const express = require('express')

const {
	createComment,
	getPostComments,
	upvoteComment,
	downvoteComment,
	deleteComment,
	getAllComments
} = require('../controllers/commentControllers')

const { protect } = require('../middlewares/authMiddlewares')
const router = express.Router()

router.post('/', protect, createComment)

router.route('/:id')
	.delete(protect, deleteComment)

router.get('/feed/:postId', getPostComments)

router.post('/:id/upvote', protect, upvoteComment)
router.post('/:id/downvote', protect, downvoteComment)

if (process.env.NODE_ENV === 'development') {
	router.get('/', getAllComments)
}

module.exports =  router