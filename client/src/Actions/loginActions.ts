import axios from 'axios'
import {
	LOGIN_REQUEST,
  AUTHENTICATION_REQUEST,
  AUTHENTICATION_SUCCESS,
  AUTHENTICATION_FAIL,
	LOGIN_FAIL,
	LOGIN_SUCCESS,
	LOGOUT
} from '../Constants/loginConstants'

import { DispatchType } from '../Store'

export const login = (username: String, password: String) => async (dispatch: DispatchType) => {
	try {
		dispatch({
			type: LOGIN_REQUEST
		})

		const config = {
      headers: {
        'Content-Type': 'application/json'
      }
  	}

		const { data } = await axios.post('/api/user/login', {
      username, password
    }, config)

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

// Only when loginInfo exist in localstorage
export const authenticate = () => async (dispatch: DispatchType) => {
  try {
		dispatch({
			type: AUTHENTICATION_REQUEST
		})

  	const userInfoFromStorage = localStorage.getItem('loginInfo') ? JSON.parse(String(localStorage.getItem('loginInfo'))) : null

		const config = {
    	headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userInfoFromStorage.token}`
      }
  	}

		const { data } = await axios.get('/api/user/authenticate', config)

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

export const logout = () => (dispatch: DispatchType) => {
  dispatch({
      type: LOGOUT
  })
  localStorage.removeItem('loginInfo')
}