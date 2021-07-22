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

import {
	UPVOTE_POST,
	DOWNVOTE_POST,
	SAVE_POST
} from '../Constants/postContants'

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
	let info:any = {}
	switch(action.type) {
		// Login actions
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
		// Post actions
		case UPVOTE_POST:
			info = state.info

			const isUpvoted = info.upvotedPosts.filter((postId:string) => postId === action.payload).length

			if (isUpvoted) {
				info.upvotedPosts = info.upvotedPosts.filter((postId:string) => postId !== action.payload)
			} else {
				info.upvotedPosts.push(action.payload)

				// Remove from downvotes posts if it is in
				const isDownvoted = info.downvotedPosts.filter((postId:string) => postId === action.payload).length
				
				if (isDownvoted) {
					info.downvotedPosts = info.downvotedPosts.filter((postId:string) => postId !== action.payload)
				}
			}

			return { ...state, info }

		case DOWNVOTE_POST:
			info = state.info
			
			const isDownvoted = info.downvotedPosts.filter((postId:string) => postId === action.payload).length

			if (isDownvoted) {
				info.downvotedPosts = info.downvotedPosts.filter((postId:string) => postId !== action.payload)
			} else {
				info.downvotedPosts.push(action.payload)

				// Remove from upvoted posts if it is in
				const isUpvoted = info.upvotedPosts.filter((postId:string) => postId === action.payload).length

				if (isUpvoted) {
					info.upvotedPosts = info.upvotedPosts.filter((postId:string) => postId !== action.payload)
				}
			}

			return { ...state , info }

		case SAVE_POST:
			info = state.info

			const isSaved = info.savedPosts.filter((postId:string) => postId === action.payload).length

			if (isSaved) {
				info.savedPosts = info.savedPosts.filter((postId:string) => postId !== action.payload)
			} else {
				info.savedPosts.push(action.payload)
			}

			return { ...state, info }

		default:
			return state
	}
}

export default loginReducer