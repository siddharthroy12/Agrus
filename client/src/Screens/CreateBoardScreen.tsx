import { useState, useRef } from 'react'
import axios from 'axios'
import {
	Snackbar, Typography, Divider,
	Paper, TextField, Button, IconButton, Avatar
} from '@material-ui/core'

import {
	Add as AddIcon
} from '@material-ui/icons'

import {
	Alert, Container, SubContainerMain,
	SubContainerAside
} from '../Components'
import { useHistory } from 'react-router'
import useAlert, { AlertType } from '../Hooks/useAlert'
import genConfig from '../Utils/genConfig'
import useMounted from '../Hooks/useMounted'
import styled from 'styled-components'

const FormWrapper = styled(Paper)`
	margin-top: 1rem;
	padding: 1rem;

	> * {
		margin-bottom: 1rem;
	}
`

const FormActions = styled.div`
	display:flex;
	flex-direction: row-reverse;
`

const CreateButton = styled(Button)`
	background-color: ${(props) => props.theme.primary};
	color: white;
`

const TextInput = styled(TextField)`
	width: 100%;
`

export default function CreateBoardScreen() {
	const [boardName, setBoardName] = useState('')
	const fileInput = useRef(null)
	const [boardDescription, setBoardDescription] = useState('')
	const [createBoardRequestPending, setCreateBoardRequestPending] = useState(false)
	const [uploading, setUploading] = useState(false)
	const [logo, setLogo] = useState("")
	const [alert, setAlert] = useAlert(false)
	const isMounted = useMounted()
	const history = useHistory()

	const submitButtonDisabled = boardName.trim() === '' ||
		boardDescription.trim() === ''

	const uploadFile = (file:any) => {
		setUploading(true)
		const formData = new FormData()

		formData.append('image', file)

		const config = {
			headers: {
				'Content-Type': 'multipart/form-data'
			}
		}

		axios.post('api/upload', formData, config)
			.then(res => {
				if (isMounted()) {
					setLogo(res.data.data.link)
					setUploading(false)
				}
			})
			.catch(function (error) {
				if (isMounted()) {
					setUploading(false)
					if (error.response) {
						// Request made and server responded (Failed to Login)
						setAlert({
							message: error.response.data.message,
							severity: 'error'
						})
						} else if (error.request) {
						// The request was made but no response was received (Slow Internet)
						setAlert({
							message: 'Failed to upload due to slow network',
							severity: 'error'
						})
						} else {
						setAlert({
							message: error + '',
							severity: 'error'
						})
					}
				}
			})
	}

	const fileInputHandle = (event: any) => {
		uploadFile(event.target.files[0])
	}

	const handleAlertClose = () => {
		setAlert(false)
	}

	const createBoard = () => {
		setCreateBoardRequestPending(true)
		let reqBody = {
			boardName,
			description: boardDescription,
			logo
		}
		axios.post('/api/board', reqBody, genConfig())
			.then(res => {
					if (isMounted()) {
						setCreateBoardRequestPending(false)
						history.push(`/b/${boardName}`)
					}
			})
			.catch(function (error) {
				if (isMounted()) {
					setCreateBoardRequestPending(false)
					if (error.response) {
						// Request made and server responded (Failed to Login)
						setAlert({
							message: error.response.data.message,
							severity: 'error'
						})
						} else if (error.request) {
						// The request was made but no response was received (Slow Internet)
						setAlert({
							message: 'Failed to upload due to slow network',
							severity: 'error'
						})
						} else {
						setAlert({
							message: error + '',
							severity: 'error'
						})
					}
				}
			})

	}

	return (
		<>
			<Snackbar
				open={Boolean(alert)}
				autoHideDuration={8000}
				onClose={handleAlertClose}
			>
				<Alert
					severity={(alert as AlertType).severity}
					message={(alert as AlertType).message}
				/>
			</Snackbar>
			<Container>
				<SubContainerMain>
					<Typography variant="h6" component="h2">
						Create board
					</Typography>
					<Divider />
					<FormWrapper square>
						<input
							accept="image/*"
							onChange={fileInputHandle}
							type="file"
							hidden
							ref={fileInput}
						/>
							<IconButton
								onClick={() => (fileInput as any).current.click()}
								disabled={uploading || createBoardRequestPending}
							>
								<Avatar src={logo}>
									<AddIcon />
								</Avatar>
							</IconButton>
						<TextInput
							label="Board Name"
							variant="outlined"
							value={boardName}
							onChange={e => setBoardName(e.target.value)}
						/>
						<TextInput
							label="Description"
							variant="outlined"
							value={boardDescription}
							multiline
							onChange={e => setBoardDescription(e.target.value)}
						/>
						<FormActions>
							<CreateButton
								variant="contained"
								disableElevation
								color="primary"
								onClick={createBoard}
								disabled={uploading||createBoardRequestPending||submitButtonDisabled}
							>
								{uploading || createBoardRequestPending ? 'Wait' : 'Create'}
							</CreateButton>
						</FormActions>
					</FormWrapper>
				</SubContainerMain>
				<SubContainerAside>
				</SubContainerAside>
			</Container>
		</>
	)
}
