import { 
	GET_AND_CACHE_USER_START, GET_AND_CACHE_USER_FINISH,
	GET_AND_CACHE_USER_FAILED, CACHE_USER
} from '../Constants/usersCacheConstants'
import {
	UPDATE_PROFILE
} from '../Constants/loginConstants'
import ActionType from './actionType'

type UsersCacheStateType = {
	users: any
}

const usersCacheReducer = (state:UsersCacheStateType = {users:{}}, action:ActionType) => {
	let users:any = {}
	switch(action.type) {
		case GET_AND_CACHE_USER_START:
			users = {...state.users}
			users[action.payload] = { pending: true }
			return {users}

		case GET_AND_CACHE_USER_FINISH:
		case CACHE_USER:
			users = {...state.users}

			users[action.payload.username] = action.payload

			return {users}

		case GET_AND_CACHE_USER_FAILED:
			users = {...state.users}
			delete users[action.payload]

			return {users}

		case UPDATE_PROFILE:
			if (state.users[action.payload.username]) {
				users = {...state.users}
				users[action.payload.username].avatar = action.payload.avatar
			}
			return {users}

		default:
			return state
	}
}

export default usersCacheReducer