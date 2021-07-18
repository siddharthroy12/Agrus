import { 
	Paper, Typography, Button,
	TextField, Divider, Link
} from '@material-ui/core'

import { Link as RouterLink } from 'react-router-dom'

import Container from '../Components/Container'

import styled from 'styled-components'
import { FormEvent } from 'react'

const Header = styled.div`
	padding: 1rem;
	background-color: ${(props) => props.theme.primary};
	color: white;
`

const Box = styled(Paper)`
	min-width: 30rem;
	margin: auto;
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
padding: 1rem;
`

export default function RegisterScreen() {

	const onFormSubmit = (e: FormEvent) => {
		e.preventDefault()
	}

	return (
		<Container>
			<Box elevation={3}>
				<Header>
					<Typography>Login</Typography>
				</Header>
				<FormBox onSubmit={onFormSubmit}>
					<TextField label="Username" />
					<TextField label="Password" />
					<Divider />
					<SubmitButtonContainer>
						<SubmitButton variant="contained" type="submit">
							Login
						</SubmitButton>
					</SubmitButtonContainer>
				</FormBox>
				<Bottom>
					<Link component={RouterLink} to='/register' >Don't have account? Register</Link>
				</Bottom>
			</Box>
		</Container>
	)
}
