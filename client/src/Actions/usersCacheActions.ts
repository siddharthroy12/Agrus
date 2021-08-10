import { 
	GET_AND_CACHE_USER_START,
	GET_AND_CACHE_USER_FINISH,
	GET_AND_CACHE_USER_FAILED,
	CACHE_USER
} from '../Constants/usersCacheConstants'
import axios from 'axios'

import { DispatchType } from '../Store'

export const getAndCacheUser = (username: string) => async(dispatch:DispatchType) => {
	try {
		dispatch({
			type: GET_AND_CACHE_USER_START,
			payload: username
		})

		const { data } = await axios.get(`/api/user/${username}`)

		dispatch({
			type: GET_AND_CACHE_USER_FINISH,
			payload: data
		})
	} catch (error) {
		dispatch({
			type: GET_AND_CACHE_USER_FAILED,
			payload: username
		})
	}
}

export const cacheUser = (user:any) => async(dispatch:DispatchType) => {
	dispatch({
		type: CACHE_USER,
		payload: user
	})
}