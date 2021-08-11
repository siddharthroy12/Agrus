import { useState, useRef, useCallback } from 'react'
import axios from 'axios'
import {
	Typography, Divider, LinearProgress,
	Paper, TextField, Button, IconButton, Avatar
} from '@material-ui/core'
import {
	Add as AddIcon
} from '@material-ui/icons'
import {
	Container, SubContainerMain,
	SubContainerAside
} from '../Components'
import { useHistory, useParams } from 'react-router'
import genConfig from '../Utils/genConfig'
import useMounted from '../Hooks/useMounted'
import { useOnMount } from '../Hooks'
import { useDispatch } from 'react-redux'
import reqErrorHandler from '../Utils/reqErrorHandler'
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

export default function UpdateBoardScreen() {
	const { boardname } = useParams<any>()
	const fileInput = useRef(null)
	const [boardDescription, setBoardDescription] = useState('')
	const [boardExist, setBoardExist] = useState(false)
	const [boardLoading, setBoardLoading] = useState(false)
	const [updateBoardRequestPending, setUpdateBoardRequestPending] = useState(false)
	const [uploading, setUploading] = useState(false)
	const [logo, setLogo] = useState("")
	const isMounted = useMounted()
	const history = useHistory()
	const dispatch = useDispatch()

	const submitButtonDisabled = boardDescription.trim() === ''

	const uploadFile = (file:any) => {
		setUploading(true)
		const formData = new FormData()

		formData.append('image', file)

		const config = {
			headers: {
				'Content-Type': 'multipart/form-data'
			}
		}

		axios.post('/api/upload', formData, config)
			.then(res => {
				if (isMounted()) {
					setLogo(res.data.data.link)
					setUploading(false)
				}
			})
			.catch(function (error) {
				if (isMounted()) {
					setUploading(false)
					reqErrorHandler(
						error,
						'Failed to upload logo due to slow network',
						dispatch
					)
				}
			})
	}

	const fileInputHandle = (event: any) => {
		uploadFile(event.target.files[0])
	}

	const updateBoard = () => {
		setUpdateBoardRequestPending(true)
		let reqBody = {
			description: boardDescription,
			logo
		}
		axios.put(`/api/board/${boardname}`, reqBody, genConfig())
			.then(res => {
					if (isMounted()) {
						setUpdateBoardRequestPending(false)
						history.push(`/b/${boardname}`)
					}
			})
			.catch(function (error) {
				if (isMounted()) {
					setUpdateBoardRequestPending(false)
					reqErrorHandler(
						error,
						'Failed to create board due to slow network',
						dispatch
					)
				}
			})
	}

	const fetchBoard = useCallback(() => {
		setBoardLoading(true)
		axios.get(`/api/board/${boardname}`)
			.then(res => {
				if (isMounted()) {
					setBoardDescription(res.data.description)
					setLogo(res.data.logo)
					setBoardExist(true)
					setBoardLoading(false)
				}
			})
			.catch(error => {
				if (isMounted()) {
					setBoardLoading(false)
					reqErrorHandler(
						error,
						'Failed to load board due to slow network',
						dispatch
					)
				}
			})
	}, [
		isMounted, boardname,
		dispatch,
	])

	useOnMount(fetchBoard)

	return (
		<Container>
			{boardLoading && <LinearProgress style={{width: '100%'}}/>}
			{boardExist && (<>
				<SubContainerMain>
					<Typography variant="h6" component="h2">
						Update Board
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
								disabled={uploading || updateBoardRequestPending}
							>
								<Avatar src={logo}>
									<AddIcon />
								</Avatar>
							</IconButton>
						<TextInput
							label="Board Name"
							variant="outlined"
							value={boardname}
							disabled
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
								onClick={updateBoard}
								disabled={
									uploading||
									updateBoardRequestPending||
									submitButtonDisabled
								}
							>
								{uploading || updateBoardRequestPending ?
									'Wait' : 'Save'
								}
							</CreateButton>
						</FormActions>
					</FormWrapper>
				</SubContainerMain>
				<SubContainerAside>
				</SubContainerAside>
			</>)}
		</Container>
	)
}
