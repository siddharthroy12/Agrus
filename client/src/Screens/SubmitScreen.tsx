import { useState, useEffect, useRef, useCallback } from 'react'
import axios from 'axios'

import { 
	Typography, Divider, TextField,
	Paper, Tabs, Tab, Button, Snackbar
} from '@material-ui/core'

import Container from '../Components/Container'
import Alert from '../Components/Alert'
import SubContainerAside from '../Components/SubContainerAside'
import SubContainerMain from '../Components/SubContainerMain'

import styled from 'styled-components'

import { useHistory, useLocation } from 'react-router'

import useAlert, { AlertType } from '../Hooks/useAlert'

import queryString from 'query-string'

const TabContentContainer = styled.div`
	padding: 1rem;
`

const BoardInput = styled(TextField)`
	margin-top: 1rem;
`

const TitleInput = styled(TextField)`
	width: 100%;
`

const TabContentBottom = styled.div`
	display: flex;
	flex-direction: row-reverse;
	padding: 1rem 0;

	> * {
		margin: 0 1rem;
	}
`

const PostButton = styled(Button)`
	background-color: ${(props) => props.theme.primary};
	color: white;
`

const ImagePreview = styled.img`
	display: block;
	width: 100%;
`

const VideoPreview = styled.video`
	display: block;
	width: 100%;
`

export default function SubmitScreen() {
	const location = useLocation()
	const [tab, setTab] = useState(0)
	const [title, setTitle] = useState('')
	const [body, setBody] = useState('')
	const [board, setBoard] = useState(queryString.parse(location.search).board)
	const [file, setFile] = useState<any>()
	const [image, setImage] = useState('')
	const [video, setVideo] = useState('')
	const [alert, setAlert] = useAlert(false)
	const [uploading, setUploading] = useState(false)
	const mounted = useRef(false)
	const history = useHistory()

	const tabHandleChange = (event:any, newValue:any) => {
		setTab(newValue)
	}

	const fileInputHandle = (event: any) => {
		setFile(event.target.files[0])
	}

	const uploadFile = useCallback(() => {
		setUploading(true)

			const formData = new FormData(); 

			let mediaType = ''

			if (tab === 1) {
				mediaType = 'image'
			} else if (tab === 2) {
				mediaType = 'video'
			}

      // Update the formData object 
      formData.append( 
      	mediaType,
        file
      )

			const config = {
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			}

			axios.post('api/upload', formData, config)
				.then(res => {
					if (mounted.current) {
						// Do stuff
						if (mediaType === 'image') {
							setImage(res.data.data.link)
							setUploading(false)
						}
						
						if (mediaType === 'video') {
							axios.get(`/api/upload/poll?ticket=${res.data.data.ticket}`)
								.then(res2 => {
									if (mounted.current) {
										setVideo(res2.data.link)
										setUploading(false)
									}
								}).catch(function (error) {
									setUploading(false)
									if (mounted.current) {
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
					}
				}).catch(function (error) {
					setUploading(false)
					if (mounted.current) {
						if (error.response) {
							// Request made and server responded (Failed to Login)
							setAlert({
								message: error.response.data.message,
								severity: 'error'
							})
							} else if (error.request) {
							// The request was made but no response was received (Slow Internet)
							setAlert({
								message: 'Failed to posts due to slow network',
								severity: 'error'
							})
							} else {
							setAlert({
								message: error + '',
								severity: 'error'
							})
						}
					}
				}
			)
	}, [file, tab, setAlert])

	const submitPost = () => {
		setUploading(true)
		const userInfoFromStorage = localStorage.getItem('loginInfo') ? JSON.parse(String(localStorage.getItem('loginInfo'))) : null
		
		const config = {
    	headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userInfoFromStorage.token}`
      }
  	}

		let type = ''
		let media = ''

		if (tab === 0) {
			type = 'text'
		} else if (tab === 1) {
			type = 'image'
			media = image
		} else if (tab === 2) {
			type = 'video'
			media = video
		}

		const data = {
			title,
			type,
			body,
			board,
			media
		}

		axios.post('api/post', data, config)
			.then(res => {
				if (mounted.current) {
					setUploading(false)
					history.push(`/post/${res.data._id}`)
					setAlert({
						message: 'Posted successfully',
						severity: 'info'
					})
				}
			}).catch(function (error) {
				setUploading(false)
				if (mounted.current) {
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
							message: 'Failed to posts due to slow network',
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

	useEffect(() => {
		if (file) {
			uploadFile()
		}
	}, [file, uploadFile])

	useEffect(() => { // To check if component is mounted or not
		mounted.current = true

		return () => { 
			mounted.current = false
		}
	}, [])

	const handleAlertClose = () => {
		setAlert(false)
	}

	return (
		<>
			<Snackbar open={Boolean(alert)} autoHideDuration={8000} onClose={handleAlertClose}>
				<Alert
					severity={(alert as AlertType).severity}
					message={(alert as AlertType).message}
				/>
			</Snackbar>
			<Container>
				<SubContainerMain>
					<Typography variant="h6" component="h2">
						Create post
					</Typography>
					<Divider />
					<BoardInput
						id="filled-basic"
						label="Board"
						variant="standard"
						value={board}
						onChange={e => setBoard(e.target.value)}
						/>
					<Paper square elevation={3}>
						<Tabs
							value={tab}
							indicatorColor="primary"
							textColor="primary"
							onChange={tabHandleChange}
							aria-label="disabled tabs example"
							variant="fullWidth"
						>
							<Tab label="Text" />
							<Tab label="Image" />
							<Tab label="Video" />
						</Tabs>
							{
								tab === 0 && (
									<TabContentContainer>
										<TitleInput
											id="filled-basic"
											label="Title" 
											variant="filled"
											value={title}
											onChange={e => setTitle(e.target.value)}
										/>
										<TitleInput
											id="filled-basic"
											label="Body"
											variant="filled"
											multiline rows={8}
											value={body}
											onChange={e => setBody(e.target.value)}
											/>
										<TabContentBottom>
											<PostButton
												variant="contained"
												color="primary"
												disableElevation
												disabled={uploading}
												onClick={submitPost}>
													Post
											</PostButton>
										</TabContentBottom>
									</TabContentContainer>
								)
							}
							{
								tab === 1 && (
									<TabContentContainer>
										<TitleInput
											id="filled-basic"
											label="Title" 
											variant="filled"
											value={title}
											onChange={e => setTitle(e.target.value)}
										/>
										{ image !== '' ? <ImagePreview src={image} alt="Preview"/> : null}
										
										<TabContentBottom>
											<PostButton
												variant="contained"
												color="primary"
												disableElevation
												disabled={uploading}
												onClick={submitPost}>
													Post
											</PostButton>
											<Button
												variant="contained"
												component="label"
												disabled={uploading}
											>
												{uploading ? 'Uploading' : 'Upload Image'}
												<input
													type="file"
													onChange={fileInputHandle}
													hidden
												/>
											</Button>
										</TabContentBottom>
									</TabContentContainer>
								)
							}
							{
								tab === 2 && (
									<TabContentContainer>
										<TitleInput
											id="filled-basic"
											label="Title" 
											variant="filled"
											value={title}
											onChange={e => setTitle(e.target.value)}
										/>
										{ video !== '' ? <VideoPreview controls src={video}>Failed to load Video</VideoPreview> : null}
										<TabContentBottom>
											<PostButton
												variant="contained"
												color="primary"
												disableElevation
												disabled={uploading}
												onClick={submitPost}>
													Post
											</PostButton>
											<Button
												variant="contained"
												component="label"
												disabled={uploading}
											>
												{uploading ? 'Uploading' : 'Upload Video'}
												<input
													type="file"
													onChange={fileInputHandle}
													hidden
												/>
											</Button>
										</TabContentBottom>
									</TabContentContainer>
								)
							}
					</Paper>
				</SubContainerMain>
				<SubContainerAside>
					{/* Rules card */}
				</SubContainerAside>
			</Container>
		</>
	)
}
