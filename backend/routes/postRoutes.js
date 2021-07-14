const express = require('express')
const {
	createPost,
	getPost,
	getAllPosts,
} = require('../controllers/postControllers')
const { protect } = require('../middlewares/authMiddlewares')
const router = express.Router()

router.post('/', protect, createPost)
router.route('/:id')
	.get(getPost)
	
if (process.env.NODE_ENV === 'development') {
	router.get('/all', getAllPosts)
}
module.exports =  router