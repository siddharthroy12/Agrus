import { AlertType } from '../Hooks/useAlert'
import Alert from './Alert'
import {
	Snackbar
} from '@material-ui/core'

type PropsType = {
	alert:AlertType,
	setAlert:(alert:AlertType|boolean) => void
}

export default function AlertDisplay({ alert, setAlert}:PropsType) {
	return (
		<Snackbar
				open={Boolean(alert)}
				autoHideDuration={8000}
				onClose={() => setAlert(false)}
			>
				<Alert
					severity={(alert as AlertType).severity}
					message={(alert as AlertType).message}
				/>
		</Snackbar>
	)
}
