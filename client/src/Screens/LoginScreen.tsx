import { useState, useEffect, FormEvent } from 'react'

import {
	Paper, Typography, Button, SnackbarContent,
	TextField, Divider, Link, Snackbar
} from '@material-ui/core'


import { Link as RouterLink } from 'react-router-dom'
import { useHistory } from 'react-router'

import styled from 'styled-components'

import { useDispatch, useSelector } from 'react-redux'

import { StateType } from '../Store'
import { login } from '../Actions/loginActions'

const Header = styled.div`
	display: flex;
	align-items: center;
	padding: 1rem;
	background-color: ${(props) => props.theme.primary};
	color: white;
`

const Box = styled(Paper)`
	max-width: 30rem;
	margin: auto;
	margin-top: 5rem;

	@media screen and (max-width: 521px) {
		margin: 0;
		min-width: 100%;
		height: 100vh;
	}
`

const FormBox = styled.form`
	padding: 1rem;

	& > .MuiFormControl-root {
		width: 100%;
		margin-bottom: 2rem;
	}
`

const SubmitButtonContainer = styled.div`
	padding: 1rem;
`

const SubmitButton = styled(Button)`
	width: 100%;
	background-color: ${(props) => props.theme.primary} !important;
	color: white !important;
`

const Bottom = styled.div`
	margin-top: auto;
	padding: 1rem;
`

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

type AlertType = {
	message: String,
	severity: String,
}

export default function LoginScreen() {
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [alert, setAlert] = useState<AlertType | boolean>(false)

	const history = useHistory()
	const dispatch = useDispatch()

	const loginState:any = useSelector<StateType>(state => state.login)

	const onFormSubmit = (e: FormEvent) => {
		e.preventDefault()
		dispatch(login(username, password))
	}

	// Check if login was successfull or not
	useEffect(() => {
		if (loginState.loggedIn) {
			history.push('/')
		}

		if (loginState.error) {
			let error = loginState.error
			if (error.response) {
				// Request made and server responded (Failed to Login)
				setAlert({
					message: error.response.data.message,
					severity: 'error'
				})
			  } else if (error.request) {
				// The request was made but no response was received (Slow Internet)
				setAlert({
					message: 'Failed to Login due to slow network',
					severity: 'error'
				})
			  } else {
				setAlert({
					message: 'Unknown Error',
					severity: 'error'
				})
			  }
		} else {
			setAlert(false)
		}

	}, [loginState])

	const handleClose = () => {
		setAlert(false)
	}

	return (
		<>
			<Snackbar open={Boolean(alert)} autoHideDuration={8000} onClose={handleClose}>
				<Alert
					severity={(alert as AlertType).severity}
					message={(alert as AlertType).message}
				/>
			</Snackbar>
			<Box elevation={3}>
				<Header>
					<Typography variant="h5" component="h1">Login</Typography>
				</Header>
				<FormBox onSubmit={onFormSubmit}>
					<TextField
						label="Username"
						value={username}
						onChange={e => setUsername(e.target.value)}
						required={true}
					/>
					<TextField
						label="Password"
						type="password"
						value={password}
						onChange={e => setPassword(e.target.value)}
						required={true}
					/>
					<Divider />
					<SubmitButtonContainer>
						<SubmitButton variant="contained" type="submit" disabled={loginState.loading}>
							Login
						</SubmitButton>
					</SubmitButtonContainer>
				</FormBox>
				<Bottom>
					<Link component={RouterLink} to='/register' >Don't have account? Register</Link>
				</Bottom>
			</Box>
		</>
	)
}
