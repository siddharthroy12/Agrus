const express = require('express')
const {
	createBoard,
	updateBoard,
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
router.post('/:boardName/join', protect, joinBoard)


if (process.env.NODE_ENV === 'development') {
	router.get('/all', getAllBoards)
}
module.exports =  router