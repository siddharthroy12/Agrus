import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

import loginReducer from './Reducers/loginReducer'
import joinedBoardsReducer from './Reducers/joinedBoardsReducer'
import alertReducer from './Reducers/alertReducer'
import usersCacheReducer from './Reducers/usersCacheReducer'

const reducers = combineReducers({
	login: loginReducer,
	joinedBoards: joinedBoardsReducer,
	alert: alertReducer,
	usersCache: usersCacheReducer
})

const userInfoFromStorage = localStorage.getItem('loginInfo') ?
	JSON.parse(String(localStorage.getItem('loginInfo'))) : null

type InitialState = {
	login: any
}

const initialState: InitialState = {
	login: userInfoFromStorage === null ? { loggedIn: false } :
		{ loggedIn: true, info : userInfoFromStorage }
}

const middlewre = [thunk]

const store = createStore(
	reducers, initialState,
	composeWithDevTools(applyMiddleware(...middlewre))
)


// Infer the `RootState` and `AppDispatch` types from the store itself
export type StateType = ReturnType<typeof store.getState>
export type GetStateType = typeof store.getState
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type DispatchType = typeof store.dispatch

export default store