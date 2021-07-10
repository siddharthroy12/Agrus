const express = require('express')
const {
	createBoard,
	updateBoard,
	deleteBoard,
} = require('../controllers/boardControllers')
const { protect } = require('../middlewares/authMiddlewares')
const router = express.Router()

router.post('/', protect, createBoard)
router.route('/:boardName')
	.put(protect, updateBoard)
	.delete(protect, deleteBoard)

module.exports =  router