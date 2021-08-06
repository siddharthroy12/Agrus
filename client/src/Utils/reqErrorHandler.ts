import { setAlert } from '../Actions/alertActions'

export default function reqErrorHandler(error:any, message:string, dispatch:any) {
	if (error.response) {
		// Request made and server responded (Failed to Login)
		dispatch(setAlert(
			error.response.data.message,
			'error'
		))
		} else if (error.request) {
		// The request was made but no response was received (Slow Internet)
		dispatch(setAlert(
			'Failed to upload due to slow network',
			'error'
		))
		} else {
		dispatch(setAlert(
			error + '',
			'error'
		))
	}
}