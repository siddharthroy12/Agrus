import { useState, useEffect, useRef, useCallback } from 'react'

import axios from 'axios'

import Container from '../Components/Container'
import SubContainerMain from '../Components/SubContainerMain'
import SubContainerAside from '../Components/SubContainerAside'
import CreatePost from '../Components/CreatePost'
import Post from '../Components/Post'

import {
	Paper, Typography, 
	Button, Snackbar, LinearProgress
} from '@material-ui/core'
import { Home as HomeIcon } from '@material-ui/icons'

import Alert from '../Components/Alert'
import { Link } from 'react-router-dom'

import { useSelector } from 'react-redux'
import { StateType } from '../Store'

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
	const [feedEnded, setFeedEnded] = useState(false)
	const [oneShot, setOneShot] = useState(false)
	const [alert, setAlert] = useAlert(false)
	const [feedLoading, setFeedLoading] = useState(false)
	const mounted = useRef(false)

	const loginState:any = useSelector((state:StateType) => state.login)

	const updateFeed = useCallback(() => {
		if (!feedLoading) {
			if (!feedEnded) {
				setFeedLoading(true)
				axios.get(`/api/post/feed/get?page=${page}&perpage=${5}`)
					.then(res => {
						if (mounted.current) {
								if (res.data.length === 0) {
									setFeedEnded(true)
								}
									// @ts-ignore
								setFeed((prevFeed) => {
									return [...prevFeed, ...res.data ]
								})
								setPage(page => page + 1)
								setFeedLoading(false)
						}
					}).catch(function (error) {
						if (mounted.current) {
							setFeedLoading(false)
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
		}
	}, [feedLoading, page, setAlert, feedEnded])


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
			if (
				(window.innerHeight + window.scrollY) 
				>= window.document.body.offsetHeight) {
				updateFeed()
			}
		}

		window.addEventListener('scroll', onScrollCheck)

		return () => {
			window.removeEventListener('scroll', onScrollCheck)
		}
	}, [updateFeed])

	return (
		<>
			<Snackbar
				open={Boolean(alert)}
				autoHideDuration={8000}
				onClose={handleAlertClose}>
					<Alert
						severity={(alert as AlertType).severity}
						message={(alert as AlertType).message}
					/>
			</Snackbar>
			<Container>
				<SubContainerMain>
					{loginState.loggedIn ? (
						<CreatePost />
					):null}
					
						{
							// @ts-ignore
							feed.map(post => <Post post={post} key={post._id}/>)
						}
					{feedLoading && <LinearProgress />}
				</SubContainerMain>
				<SubContainerAside>
					<PageDescriptionBox elevation={1}>
						<PageDescriptionTop>
							<HomeIcon />
							<Typography>Home</Typography>
						</PageDescriptionTop>
						<PageDescription>
							This is the front page of this site,
							you can join boards, create posts,
							interact with others and lot more, but behave properly
						</PageDescription>
						<Button 
							variant="contained"
							disableElevation component={Link}
							to='/submit'>
								Create a Post
						</Button>
					</PageDescriptionBox>
				</SubContainerAside>
			</Container>
		</>
	)
}
