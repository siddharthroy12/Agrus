import { 
	GET_AND_CACHE_BOARD_START, GET_AND_CACHE_BOARD_FINISH,
	GET_AND_CACHE_BOARD_FAILED, CACHE_BOARD, UPDATE_BOARD
} from '../Constants/boardsCacheConstants'
import ActionType from './actionType'

type BoardsCacheStateType = {
	boards: any
}

const boardsCacheReducer = (state:BoardsCacheStateType = {boards:{}}, action:ActionType) => {
	let boards:any = {}
	switch(action.type) {
		case GET_AND_CACHE_BOARD_START:
			boards = {...state.boards}
			boards[action.payload] = { pending: true }
			return {boards}

		case GET_AND_CACHE_BOARD_FINISH:
		case CACHE_BOARD:
			boards = {...state.boards}

			boards[action.payload.boardName] = action.payload

			return {boards}

		case GET_AND_CACHE_BOARD_FAILED:
			boards = {...state.boards}
			delete boards[action.payload]

			return {boards}

		case UPDATE_BOARD:
			if (state.boards[action.payload.boardName]) {
				boards = {...state.boards}
				boards[action.payload.boardName] = action.payload
			}
			return {boards}

		default:
			return state
	}
}

export default boardsCacheReducer