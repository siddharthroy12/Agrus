import { 
	GET_AND_CACHE_BOARD_START, GET_AND_CACHE_BOARD_FINISH,
	GET_AND_CACHE_BOARD_FAILED, CACHE_BOARD, UPDATE_BOARD
} from '../Constants/boardsCacheConstants'
import axios from 'axios'

import { DispatchType } from '../Store'

export const getAndCacheBoard = (boardname: string) => async(dispatch:DispatchType) => {
	try {
		dispatch({
			type: GET_AND_CACHE_BOARD_START,
			payload: boardname
		})

		const { data } = await axios.get(`/api/board/${boardname}`)

		dispatch({
			type: GET_AND_CACHE_BOARD_FINISH,
			payload: data
		})
	} catch (error) {
		dispatch({
			type: GET_AND_CACHE_BOARD_FAILED,
			payload: boardname
		})
	}
}

export const cacheBoard = (board:any) => async(dispatch:DispatchType) => {
	dispatch({
		type: CACHE_BOARD,
		payload: board
	})
}

export const updateBoard = (board:any) => async(dispatch:DispatchType) => {
	dispatch({
		type: UPDATE_BOARD,
		payload: board
	})
}