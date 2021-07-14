const asyncHandler = require('express-async-handler')
const Board = require('../models/Board')
const Post = require('../models/Post')

// @desc Create a Board
// @route POST /api/board
// @access Private
const createBoard = asyncHandler(async (req, res) => {
	const { boardName, description } = req.body

	if (boardName === undefined || description === undefined) {
		res.status(400)
		throw new Error('Provide all feilds')
	}

	if (boardName.trim() === '' || description.trim() === '') {
		res.status(400)
		throw new Error('Provide all feilds')
	}

	const boardExist = await Board.findOne({boardName: boardName.trim()})

	if (boardExist) {
		res.status(400)
		throw new Error(`Board with the name ${boardName} already exist`)
	}

	try {
		const newBoard = await Board.create({
			author: req.user._id,
			boardName : boardName.trim(),
			description: description.trim()
		})

		res.status(200)
		res.json(newBoard)

	} catch (error) {
		res.status(500)
		throw new Error(error.message)
	}
})

// @desc Update a Board (description, logo)
// @route PUT /api/board/:boardName
// @access Private
const updateBoard = asyncHandler(async (req, res) => {
	const board = await Board.findOne({boardName: req.params.boardName})

	if (!board) {
		res.status(404)
		throw new Error('Board not found')
	}

	if (board.author.toString() !== req.user._id.toString() && req.user.isAdmin === false) {
		res.status(403)
		throw new Error('You do not have permission')
	}

	const { description, logo } = req.body

	if (description !== undefined) {
		if (description.trim() === '') {
			res.status(400)
			throw new Error('Description cannot be empty')
		}

		board.description = description
	}

	board.logo = logo === undefined ? board.logo : logo

	try {
		await board.save()
	} catch(error) {
		res.status(500)
		throw new Error('Could not update board because of internal error')
	}

	res.status(200)
	res.json(board)

})

// @desc Delete a Board (including posts)
// @route DELETE /api/board/:boardName
// @access Private
const deleteBoard = asyncHandler(async (req, res) => {
	const board = await Board.findOne({boardName: req.params.boardName})

	if (!board) {
		res.status(404)
		throw new Error('Board not found')
	}

	if (board.author.toString() !== req.user._id.toString() && req.user.isAdmin === false) {
		res.status(403)
		throw new Error('You do not have permission for this')
	}

	try {
		await board.delete()
		await Post.deleteMany({board: req.params.boardName})
	} catch(error) {
		res.status(500)
		throw new Error('Could not deleted board because of internal error')
	}

	res.status(200)
	res.json({message: 'Board deleted successfully'})
})

// @desc Join and Leave Board
// @route POST /api/board/:boardName/join
// @access Private
const joinBoard = asyncHandler(async (req, res) => {
	const board = await Board.findOne({boardName: req.params.boardName})

	if (!board) {
		res.status(404)
		throw new Error('Board Not found')
	}

	const hasAlreadyJoined = req.user.joinedBoards.filter((boardId) => {
		return (boardId.toString() === board._id.toString())
	}).length

	// If already joined then leave
	if (hasAlreadyJoined) {
		// Remove the joined board
		req.user.joinedBoards = req.user.joinedBoards.filter((boardId) => {
			return (boardId.toString() !== board._id.toString())
		})

		await Board.updateOne({boardName: req.params.boardName}, {
			$inc: {
				members: -1
			}
		})

		await req.user.save()

		res.status(200)
		res.json({message: 'Board left successfully'})
		return
	}

	req.user.joinedBoards.push(board._id)
	await req.user.save()
	
	await Board.updateOne({boardName: req.params.boardName}, {
		$inc: {
			members: 1
		}
	})

	res.status(200)
	res.json({message: 'Board joined successfully'})
})


// @desc Get All Boards
// @route GET /api/board/all
// @access Public/Development
const getAllBoards = asyncHandler(async (req, res) => {
	if (process.env.NODE_ENV === 'development') {
		const boards = await Board.find({})
		res.json(boards)
	} else {
		res.status(400)
		throw new Error('Not permitted')
	}
})

module.exports = {
	createBoard,
	updateBoard,
	deleteBoard,
	getAllBoards,
	joinBoard,
}