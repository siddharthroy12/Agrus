import {
	LOGIN_REQUEST,
	AUTHENTICATION_REQUEST,
	AUTHENTICATION_SUCCESS,
	LOGIN_FAIL,
	LOGIN_SUCCESS,
	LOGOUT,
	AUTHENTICATION_FAIL,
	REGISTER_REQUEST,
	REGISTER_SUCCESS,
	REGISTER_FAIL
} from '../Constants/loginConstants'

type actionType = {
	type: string,
	payload?: any
}
type LoginType = {
	loading?: boolean,
	info?: any,
	loggedIn: boolean
}

const loginReducer = (state: LoginType = { loggedIn: false }, action: actionType) => {
	switch(action.type) {
		case LOGIN_REQUEST:
		case REGISTER_REQUEST:
			return { loading: true }
		case AUTHENTICATION_REQUEST:
			return { loading: true, ...state }
		case AUTHENTICATION_SUCCESS:
			return { loggedIn: true, info: { ...state.info, ...action.payload } }
		case AUTHENTICATION_FAIL:
			// If authentication failed eg. Token expired or invalid, log out permanently
			if (action.payload.error.response ) {
				localStorage.removeItem('loginInfo')
			}
			return { loggedIn: false }
		case LOGIN_SUCCESS:
		case REGISTER_SUCCESS:
			localStorage.setItem('loginInfo', JSON.stringify(action.payload))
			return { loggedIn: true, info: action.payload }
		case LOGIN_FAIL:
		case REGISTER_FAIL:
			return { loading: false, loggedIn: false, error: action.payload }
		case LOGOUT:
			return { loggedin: false }
		default:
			return state
	}
}

export default loginReducer