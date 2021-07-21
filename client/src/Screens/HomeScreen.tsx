import { useState, useEffect, useRef, useCallback } from 'react'

import axios from 'axios'

import Container from '../Components/Container'
import SubContainerMain from '../Components/SubContainerMain'
import SubContainerAside from '../Components/SubContainerAside'
import CreatePost from '../Components/CreatePost'
import Post from '../Components/Post'

import { Paper, Typography, Button, Snackbar } from '@material-ui/core'
import { Home as HomeIcon } from '@material-ui/icons'

import Alert from '../Components/Alert'
import { Link } from 'react-router-dom'

import useAlert, { AlertType } from '../Hooks/useAlert'

import styled from 'styled-components'

const PageDescriptionBox = styled(Paper)`
	padding: 1rem;
`
const PageDescriptionTop = styled.div`
	display: flex;
	align-items: center;

	& > * {
		margin-right: 1rem;
	}
`

const PageDescription = styled(Typography)`
	margin-top: 1rem;
`

export default function HomeScreen() {
	const [feed, setFeed] = useState([])
	const [page, setPage] = useState(1)
	const [oneShot, setOneShot] = useState(false)
	const [alert, setAlert] = useAlert(false)
	const [feedLoading, setFeedLoading] = useState(false)
	const mounted = useRef(false)

	const updateFeed = useCallback(() => {
		if (!feedLoading) {
			setFeedLoading(true)
			axios.get(`/api/post/feed/get?page=${page}&perpage=${5}`)
				.then(res => {
					if (mounted.current) {
						// @ts-ignore
						setFeed((prevFeed) => {
							return [...prevFeed, ...res.data ]
						})
						setPage(page => page + 1)
						setFeedLoading(false)
					}
				}).catch(function (error) {
					setFeedLoading(false)
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
		}
	}, [feedLoading, page, setAlert])


	const handleAlertClose = () => {
		setAlert(false)
	}

	useEffect(() => { // Update one time at start
		if (!oneShot) { // Run only once
			updateFeed()
			setOneShot(true)
		}
		
	}, [updateFeed, oneShot, setOneShot])

	useEffect(() => { // To check if component is mounted or not
		mounted.current = true

		return () => { 
			mounted.current = false
		}
	}, [])

	useEffect(() => { // If Update function changes reapply the event listner
		const onScrollCheck = () => {
			// When on end of the page
			if ((window.innerHeight + window.scrollY) >= window.document.body.offsetHeight) {
				updateFeed()
			}
		}

		window.addEventListener('scroll', onScrollCheck)

		return () => {
			window.removeEventListener('scroll', onScrollCheck)
		}
	}, [updateFeed])

	console.log('feed:', feed)

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
					<CreatePost />
						{
							feed.map(post => <Post post={post} />)
						}
					{feedLoading && <p>Loading</p>}
				</SubContainerMain>
				<SubContainerAside>
					<PageDescriptionBox elevation={3}>
						<PageDescriptionTop>
							<HomeIcon />
							<Typography>Home</Typography>
						</PageDescriptionTop>
						<PageDescription>
							Your personal Reddit frontpage. Come here to check in with your favorite communities.
						</PageDescription>
						<Button variant="contained" disableElevation component={Link} to='/submit'>Create a Post</Button>
					</PageDescriptionBox>
				</SubContainerAside>
			</Container>
		</>
	)
}
