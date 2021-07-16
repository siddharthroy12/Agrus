const express = require('express')
const {
	createPost,
	getPost,
	editPost,
	upvotePost,
	downvotePost,
	savePost,
	deletePost,
	getAllPosts,
} = require('../controllers/postControllers')
const { protect } = require('../middlewares/authMiddlewares')
const router = express.Router()

router.post('/', protect, createPost)

router.route('/:id')
	.get(getPost)
	.delete(protect, deletePost)
	.put(protect, editPost)

router.post('/:id/save', protect, savePost)
router.post('/:id/upvote', protect, upvotePost)
router.post('/:id/downvote', protect, downvotePost)

if (process.env.NODE_ENV === 'development') {
	router.get('/', getAllPosts)
}
module.exports =  router