import { SnackbarContent } from '@material-ui/core'
import styled from 'styled-components'

type AlertProps = {
	severity: String
}

const Alert = styled(SnackbarContent)<AlertProps>`
	color: white !important; 
	background-color: ${(props) => {
		switch(props.severity) {
			case 'info':
				return props.theme.primary
			case 'error':
				return '#F44336'
			case 'success':
				return '#4CAF50'
			default:
			return '#151719'
		}
	}} !important;
`

export default Alert