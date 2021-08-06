import { SET_ALERT, CLEAR_ALERT } from '../Constants/alertConstants'

type ActionType = {
	type: string,
	payload?: any
}

export type StateType = {
	active: boolean,
	message?: string,
	severity?: 'info' | 'error' | 'success'
}

const defaultState:StateType = {
	active: false
}

const alertReducer = (state:StateType = defaultState, action:ActionType) => {
	switch (action.type) {
		case SET_ALERT:
			return {
				active: true,
				message: action.payload.message,
				severity: action.payload.severity
			}
		case CLEAR_ALERT:
			return {
				active: false
			}
		default:
			return state
		}
}

export default alertReducer