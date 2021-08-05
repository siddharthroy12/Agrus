const asyncHandler = require('express-async-handler')
const Board = require('../models/Board')
const Post = require('../models/Post')

// @desc Create a Board
// @route POST /api/board
// @access Private
const createBoard = asyncHandler(async (req, res) => {
	const { boardName, description, logo } = req.body

	if (boardName === undefined || description === undefined) {
		res.status(400)
		throw new Error('Provide all feilds')
	}

	if (boardName.trim() === '' || description.trim() === '') {
		res.status(400)
		throw new Error('Provide all feilds')
	}

	// Boardname must be 1 - 20 length and only contains numbers and letters
  if (boardName < 1 || boardName > 20) {
		res.status(400)
    throw new Error('Boardname must be 1-20 characters')
  } else if (/\W/.test(boardName)) {
    res.status(400)
    throw new Error('BoardName can only have numbers and letters')
  }

	if (logo === undefined) {
		logo = ''
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
			description: description.trim(),
			logo: logo.trim()
		})

		res.status(200)
		res.json(newBoard)

	} catch (error) {
		res.status(500)
		throw new Error(error.message)
	}
})

// @desc Search for boards
// @route GET /api/board/search/get?search=
// @access Public
const searchBoards = asyncHandler(async (req, res) => {
	if (!req.query.search) {
		res.status(400)
		throw new Error('search query is empty')
	}

	const result = await Board.find({$text: {$search: req.query.search}})
	res.status(200)
	res.json(result)
})

// @desc Update a Board (description, logo)
// @route PUT /api/board/:boardName
// @access Private
const updateBoard = asyncHandler(async (req, res) => {
	const boardName = req.params.boardName
	// Boardname must be 1 - 20 length and only contains numbers and letters
	if (boardName < 1 || boardName > 20) {
		res.status(400)
		throw new Error('Boardname must be 1-20 characters')
	} else if (/\W/.test(boardName)) {
		res.status(400)
		throw new Error('BoardName can only have numbers and letters')
	}

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
	const boardName = req.params.boardName
	// Boardname must be 1 - 20 length and only contains numbers and letters
	if (boardName < 1 || boardName > 20) {
		res.status(400)
		throw new Error('Boardname must be 1-20 characters')
	} else if (/\W/.test(boardName)) {
		res.status(400)
		throw new Error('BoardName can only have numbers and letters')
	}

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

// @desc Get Board Details
// @route POST /api/board/:boardName
// @access Public
const getBoard = asyncHandler(async (req, res) => {
	const boardName = req.params.boardName
	// Boardname must be 1 - 20 length and only contains numbers and letters
	if (boardName < 1 || boardName > 20) {
		res.status(400)
		throw new Error('Boardname must be 1-20 characters')
	} else if (/\W/.test(boardName)) {
		res.status(400)
		throw new Error('BoardName can only have numbers and letters')
	}

	const board = await Board.findOne({boardName: req.params.boardName})
	
	if (!board) {
		res.status(404)
		throw new Error('Board not found')
	}

	res.status(200)
	res.json(board)
})

// @desc Get feed of board
// @route Get /api/board/:boardname/feed?page=1&perpage=2
// @access Public
const getBoardFeed = asyncHandler(async (req, res) => {
	const { page, perpage } = req.query
	const { boardname } = req.params

	if (page === undefined || perpage === undefined) {
		res.status(400)
		throw new Error('Provide page and perpage')
	}

	var query = await Post.find({ board: boardname }).sort({ createdAt: -1 }).skip((page-1) * perpage).limit(perpage * 1)

	res.status(200)
	res.json(query)
})

// @desc Join and Leave Board
// @route POST /api/board/:boardName/join
// @access Private
const joinBoard = asyncHandler(async (req, res) => {
	const boardName = req.params.boardName
	// Boardname must be 1 - 20 length and only contains numbers and letters
	if (boardName < 1 || boardName > 20) {
		res.status(400)
		throw new Error('Boardname must be 1-20 characters')
	} else if (/\W/.test(boardName)) {
		res.status(400)
		throw new Error('BoardName can only have numbers and letters')
	}

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
// @route GET /api/board/
// @access Public/Development
const getAllBoards = asyncHandler(async (req, res) => {
	if (process.env.NODE_ENV === 'development') {
		const boards = await Board.find({})
		res.status(200)
		res.json(boards)
	} else {
		res.status(400)
		throw new Error('Not permitted')
	}
})

module.exports = {
	createBoard,
	searchBoards,
	updateBoard,
	deleteBoard,
	getBoard,
	getBoardFeed,
	getAllBoards,
	joinBoard,
}