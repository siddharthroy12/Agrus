import axios from 'axios'
import genConfig from '../Utils/genConfig'
import {
	LOGIN_REQUEST, AUTHENTICATION_REQUEST, AUTHENTICATION_SUCCESS,
  AUTHENTICATION_FAIL, LOGIN_FAIL, LOGIN_SUCCESS,
	LOGOUT, UPDATE_PROFILE, REGISTER_REQUEST, REGISTER_SUCCESS,
  REGISTER_FAIL
} from '../Constants/loginConstants'
import { DispatchType, GetStateType } from '../Store'

export const login = (username: String, password: String) => async (dispatch: DispatchType) => {
	try {
		dispatch({
			type: LOGIN_REQUEST
		})

		const { data } = await axios.post('/api/user/login', {
      username, password
    }, genConfig())

		dispatch({
      type: LOGIN_SUCCESS,
      payload: data
    })
	} catch (error) {
		dispatch({
      type: LOGIN_FAIL,
      payload: error
    })
	}
}

export const register = (username: String, password: String) => async (dispatch: DispatchType) => {
  try {
		dispatch({
			type: REGISTER_REQUEST
		})

		const { data } = await axios.post('/api/user/register', {
      username, password
    }, genConfig())

		dispatch({
      type: REGISTER_SUCCESS,
      payload: data
    })
	} catch (error) {
		dispatch({
      type: REGISTER_FAIL,
      payload: error
    })
	}
}

// Only when loginInfo exist in localstorage
export const authenticate = () => async (dispatch: DispatchType) => {
  try {
		dispatch({
			type: AUTHENTICATION_REQUEST
		})

		const { data } = await axios.get('/api/user/authenticate', genConfig())

		dispatch({
      type: AUTHENTICATION_SUCCESS,
      payload: data
    })
		} catch (error) {
			dispatch({
        type: AUTHENTICATION_FAIL,
        payload: error
    })
	}
}

export const updateProfile = (avatar:string) => async(dispatch:DispatchType, getState:GetStateType) => {
  const loginState:any = getState().login

  dispatch({
    type: UPDATE_PROFILE,
    payload: {
      username: loginState.info.username,
      avatar
    }
  })
}

export const logout = () => (dispatch: DispatchType) => {
  dispatch({
      type: LOGOUT
  })
  localStorage.removeItem('loginInfo')
}