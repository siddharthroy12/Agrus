import { 
	GET_AND_CACHE_USER_START,
	GET_AND_CACHE_USER_FINISH,
	GET_AND_CACHE_USER_FAILED,
	CACHE_USER
} from '../Constants/usersCacheConstants'
import ActionType from './actionType'

type UserCacheStateType = {
	users: any
}

const usersCacheReducer = (state:UserCacheStateType = {users:{}}, action:ActionType) => {
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

		default:
			return state
	}
}

export default usersCacheReducer