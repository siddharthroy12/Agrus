import { 
	FETCH_JOINED_BOARDS_START, FETCH_JOINED_BOARDS_FINISH, JOIN_BOARD 
} from '../Constants/joinedBoardsConstants'

type ActionType = {
	type: string,
	payload?: any
}

type StateType = {
	loading: boolean,
	data?:any[]
}

const joinedBoardsReducer = (state: StateType = { loading: true }, action: ActionType) => {
	let data = []
	let isJoined = false
	switch (action.type) {
		case FETCH_JOINED_BOARDS_START:
			return { loading: true }
		case FETCH_JOINED_BOARDS_FINISH:
			return { loading: false, data: action.payload }
		case JOIN_BOARD:
			data = [...(state.data as any)]

			isJoined = data.filter((board:any) => board._id === action.payload._id).length ? true : false

			if (isJoined) {
				data = data.filter((board:any) => board._id !== action.payload._id)
			} else {
				data.push(action.payload)
			}

			return {...state, data}
		default:
			return state
	}
}

export default joinedBoardsReducer