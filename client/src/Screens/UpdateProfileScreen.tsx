import { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import {
	Container, ButtonPrimary
} from '../Components'
import styled from 'styled-components'
import {
	IconButton, Avatar, Button, TextField
} from '@material-ui/core'
import { useSelector, useDispatch } from 'react-redux'
import { StateType } from '../Store'
import { useMounted } from '../Hooks'
import { genConfig, reqErrorHandler } from '../Utils'
import { setAlert } from '../Actions/alertActions'
import { updateProfile } from '../Actions/loginActions'

const Wrapper = styled(Container)`
	display: flex;
	padding-top: 7rem;
	align-items: center;
	flex-direction: column;

	> * {
		margin-bottom: 1rem;
	}
`

const BioField = styled(TextField)`
	min-width: 20rem;
`

export default function UpdateProfileScreen() {
	const loginState:any = useSelector((state: StateType) => state.login)
	const [bio, setBio] = useState('')
	const [avatar, setAvatar] = useState('')
	const [uploading, setUploading] = useState(false)
	const [savePending, setSavePending] = useState(false)
	const isMounted = useMounted()
	const dispatch = useDispatch()
	
	useEffect(() => {
		setBio(loginState.info.bio)
		setAvatar(loginState.info.avatar)
	}, [loginState.info])

	const fileInput = useRef(null)

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
					setAvatar(res.data.data.link)
					setUploading(false)
				}
			})
			.catch(function (error) {
				if (isMounted()) {
					setUploading(false)
					reqErrorHandler(
						error,
						'Failed to upload avatar due to slow network',
						dispatch
					)
				}
			})
	}

	const fileInputHandle = (event:any) => {
		uploadFile(event.target.files[0])
	}

	const save = () => {
		if (!savePending)	{
			setSavePending(true)
			const reqBody = {
				avatar,
				bio
			}
			axios.put('/api/user/update', reqBody, genConfig())
				.then(res => {
					if (isMounted()) {
						dispatch(setAlert(
							'Profile Updated',
							'info'
						))
						dispatch(updateProfile(res.data.avatar))
						setSavePending(false)
					}
				})
				.catch(function (error) {
					if (isMounted()) {
						setUploading(false)
						reqErrorHandler(
							error,
							'Failed to update profile due to slow network',
							dispatch
						)
					}
				})

		}
	}

	return (
		<Wrapper>
			<input
				accept="image/*"
				onChange={fileInputHandle}
				type="file"
				hidden
				ref={fileInput}
			/>
			<IconButton
				size="small"
				onClick={() => (fileInput as any).current.click()}
				disabled={uploading || savePending}
			>
				<Avatar
					src={avatar}
					style={{width: '40xp', height: '40px'}}>
					{ loginState.info.username[0].toUpperCase() }
				</Avatar>
			</IconButton>
			<Button
				onClick={() => (fileInput as any).current.click()}
				disabled={uploading || savePending}
			>
				{uploading ? 'Uploading' : 'Change Avatar'}
			</Button>
			<BioField
				label="Bio"
				variant="outlined"
				value={bio}
				rows={5}
				multiline
				onChange={e => setBio(e.target.value)}
			/>
			<ButtonPrimary
				color="primary"
				variant="contained"
				disabled={uploading || savePending}
				onClick={save}
			>
				{savePending ? 'Saving' : 'Save'}
			</ButtonPrimary>
		</Wrapper>
	)
}
