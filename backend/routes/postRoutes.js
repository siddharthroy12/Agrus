const express = require('express')
const {
	createPost,
	getPost,
	deletePost,
	getAllPosts,
} = require('../controllers/postControllers')
const { protect } = require('../middlewares/authMiddlewares')
const router = express.Router()

router.post('/', protect, createPost)
router.route('/:id')
	.get(getPost)
	.delete(protect, deletePost)
	
if (process.env.NODE_ENV === 'development') {
	router.get('/', getAllPosts)
}
module.exports =  router