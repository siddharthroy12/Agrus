import { useState, useEffect, FormEvent } from 'react'
import {
	Paper, Typography, Button,
	TextField, Divider, Link,
} from '@material-ui/core'
import { Link as RouterLink } from 'react-router-dom'
import { useHistory, useLocation } from 'react-router'
import queryString from 'query-string'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'
import reqErrorHandler from '../Utils/reqErrorHandler'
import { setAlert, clearAlert } from '../Actions/alertActions'
import { StateType } from '../Store'
import { register } from '../Actions/loginActions'

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

export default function RegisterScreen() {
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const location = useLocation()
	const history = useHistory()
	const dispatch = useDispatch()
	const redirect = queryString.parse(location.search).redirect
		? queryString.parse(location.search).redirect : encodeURIComponent('/')

	const loginState:any = useSelector<StateType>(state => state.login)

	const onFormSubmit = (e: FormEvent) => {
		e.preventDefault()

		if (password !== confirmPassword) {
			dispatch(setAlert(
				'Password and confirm password did not match',
				'error'
			))
			return
		}

		dispatch(register(username, password))
	}

	// Check if login was successfull or not
	useEffect(() => {
		if (loginState.loggedIn) {
			history.push(redirect as string)
		}

		if (loginState.error) {
			let error = loginState.error
			reqErrorHandler(error, 'Failed to register due to slow network', dispatch)
		} else {
			dispatch(clearAlert())
		}

	}, [
		loginState, history,
		location.search,
		redirect, dispatch
	])


	return (
		<Box elevation={3}>
			<Header>
				<Typography variant="h5" component="h1">Register</Typography>
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
				<TextField
					label="Confirm Password"
					type="password"
					value={confirmPassword}
					onChange={e => setConfirmPassword(e.target.value)}
					required={true}
				/>
				<Divider />
				<SubmitButtonContainer>
					<SubmitButton
						variant="contained"
						type="submit"
						disabled={loginState.loading}
					>
						Register
					</SubmitButton>
				</SubmitButtonContainer>
			</FormBox>
			<Bottom>
				<Link
					component={RouterLink}
					to={`/login?redirect=${redirect}`}
					>
						Already have account? Login
				</Link>
			</Bottom>
		</Box>
	)
}
