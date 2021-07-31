import { useState } from 'react'
import { useParams } from 'react-router'

import {
	Paper, Typography, 
	Button, Snackbar, LinearProgress
} from '@material-ui/core'

import Container from '../Components/Container'
import SubContainerMain from '../Components/SubContainerMain'
import SubContainerAside from '../Components/SubContainerAside'
import CreatePost from '../Components/CreatePost'
import Post from '../Components/Post'

import Alert from '../Components/Alert'
import useAlert, { AlertType } from '../Hooks/useAlert'

import useMounted from '../Hooks/useMounted'

export default function BoardScreen() {
	const params:any = useParams()
	const [alert, setAlert] = useAlert(false)

	const handleAlertClose = () => {
		setAlert(false)
	}

	return (<>
		<Snackbar
			open={Boolean(alert)}
			autoHideDuration={8000}
			onClose={handleAlertClose}>
				<Alert
					severity={(alert as AlertType).severity}
					message={(alert as AlertType).message}
				/>
			</Snackbar>
		{params.boardname}
		</>)
}
