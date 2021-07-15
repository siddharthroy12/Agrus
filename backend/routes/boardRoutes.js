const express = require('express')
const {
	createBoard,
	updateBoard,
	getBoard,
	deleteBoard,
	getAllBoards,
	joinBoard
} = require('../controllers/boardControllers')
const { protect } = require('../middlewares/authMiddlewares')
const router = express.Router()

router.post('/', protect, createBoard)
router.route('/:boardName')
	.put(protect, updateBoard)
	.delete(protect, deleteBoard)
	.get(getBoard)
router.post('/:boardName/join', protect, joinBoard)

if (process.env.NODE_ENV === 'development') {
	router.get('/', getAllBoards)
}

module.exports =  router