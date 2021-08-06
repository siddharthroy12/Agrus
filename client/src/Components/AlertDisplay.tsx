import { StateType as AlertStateType } from '../Reducers/alertReducer'
import Alert from './Alert'
import {
	Snackbar
} from '@material-ui/core'

type PropsType = {
	alert:AlertStateType,
	closeAlert:() => void
}

export default function AlertDisplay({ alert, closeAlert }:PropsType) {
	return (
		<Snackbar
			open={alert.active}
			autoHideDuration={8000}
			onClose={() => closeAlert()}
		>
			<Alert
				severity={alert.severity as any}
				message={alert.message}
			/>
		</Snackbar>
	)
}
