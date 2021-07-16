import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

import loginReducer from './Reducers/loginReducer'

const reducers = combineReducers({
	login: loginReducer
})

const initialState = {

}

const middlewre = [thunk]

const store = createStore(reducers, initialState, composeWithDevTools(applyMiddleware(...middlewre)))

export default store