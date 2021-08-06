import { SET_ALERT, CLEAR_ALERT } from '../Constants/alertConstants'
import { DispatchType } from '../Store'

export const clearAlert = () => async(dispatch:DispatchType) => {
	dispatch({
		type: CLEAR_ALERT
	})
}

export const setAlert = (
	message: string,
	severity: 'info' | 'error' | 'success') => async(dispatch:DispatchType) => {
	dispatch({
		type: SET_ALERT,
		payload: {
			message,
			severity
		}
	})
}