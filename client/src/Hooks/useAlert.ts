import { useState } from 'react'

export type AlertType = {
	message: String,
	severity: String,
}

function useAlert(alert: AlertType | boolean) {
	return useState(alert)
}

export default useAlert