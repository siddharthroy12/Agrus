import axios from 'axios'
import genConfig from '../Utils/genConfig'

import {
	FETCH_JOINED_BOARDS_START,
	FETCH_JOINED_BOARDS_FINISH,
	JOIN_BOARD,
} from '../Constants/joinedBoardsConstants'
import { DispatchType } from '../Store'

export const joinBoard = (board: any) => async(dispatch: DispatchType) => {
	dispatch({
		type: JOIN_BOARD,
		payload: board
	})
}

export const fetchJoinedBoards = () => async(dispatch: DispatchType) => {
	dispatch({
		type: FETCH_JOINED_BOARDS_START
	})

	let { data } = await axios.get('/api/user/joinedboards/get', genConfig())

	dispatch({
		type: FETCH_JOINED_BOARDS_FINISH,
		payload: data
	})
}