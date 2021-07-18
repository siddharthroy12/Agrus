import {
	LOGIN_REQUEST,
	AUTHENTICATION_REQUEST,
	AUTHENTICATION_SUCCESS,
	LOGIN_FAIL,
	LOGIN_SUCCESS,
	LOGOUT,
	AUTHENTICATION_FAIL
} from '../Constants/loginConstants'

type actionType = {
	type: string,
	payload?: any
}

const loginReducer = (state = { }, action: actionType) => {
	switch(action.type) {
		case LOGIN_REQUEST:
			return { loading: true }
		case AUTHENTICATION_REQUEST:
			return { loading: true, ...state }
		case AUTHENTICATION_SUCCESS:
			return { loggedIn: true, info: action.payload }
		case AUTHENTICATION_FAIL:
			// If authentication failed eg. Token expired or invalid, log out permanently
			if (action.payload.error.response ) {
				localStorage.removeItem('loginInfo')
			}
			return { loggedIn: false }
		case LOGIN_SUCCESS:
			localStorage.setItem('loginInfo', JSON.stringify(action.payload))
			return { loggedIn: true, info: action.payload }
		case LOGIN_FAIL:
			return { loading: false, loggedIn: false, error: action.payload }
		case LOGOUT:
			return { loggedin: false }
		default:
			return state
	}
}

export default loginReducer