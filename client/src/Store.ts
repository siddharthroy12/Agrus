import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

import loginReducer from './Reducers/loginReducer'

const reducers = combineReducers({
	login: loginReducer
})

const userInfoFromStorage = localStorage.getItem('loginInfo') ? JSON.parse(String(localStorage.getItem('loginInfo'))) : null

const initialState = {
	login: userInfoFromStorage === null ? { loggedIn: false } : { loggedIn: true, info : userInfoFromStorage }
}

const middlewre = [thunk]

const store = createStore(reducers, initialState, composeWithDevTools(applyMiddleware(...middlewre)))


// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootStateType = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type DispatchType = typeof store.dispatch

export default store