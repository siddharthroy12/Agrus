import { useState, useCallback, useEffect } from 'react'
import { useParams } from 'react-router'
import axios from 'axios'
import {
	Typography, Card, CardHeader, CardContent,
	Button, Snackbar, LinearProgress, Avatar
} from '@material-ui/core'

import { useSelector, useDispatch } from 'react-redux'
import { StateType } from '../Store'

import { joinBoard } from '../Actions/boardActions'
import genConfig from '../Utils/genConfig'
import { Link } from 'react-router-dom'

import Container from '../Components/Container'
import SubContainerMain from '../Components/SubContainerMain'
import SubContainerAside from '../Components/SubContainerAside'
import CreatePost from '../Components/CreatePost'
import Post from '../Components/Post'

import Alert from '../Components/Alert'
import useAlert, { AlertType } from '../Hooks/useAlert'

import useMounted from '../Hooks/useMounted'

type BoardType = {
	_id: string,
	author: string,
	boardName: string,
	logo: string,
	description: string,
	members: number,
	createdAt: string
}

export default function BoardScreen() {
	const params:any = useParams()
	const [feed, setFeed] = useState([])
	const [page, setPage] = useState(1)
	const [feedEnded, setFeedEnded] = useState(false)
	const loginState:any = useSelector((state:StateType) => state.login)
	const [feedLoading, setFeedLoading] = useState(false)
	const [alert, setAlert] = useAlert(false)
	const [board, setBoard] = useState<BoardType | null>(null)
	const [oneShot, setOneShot] = useState(false)
	const [boardLoading, setBoardLoading] = useState(true)
	const [isJoined, setIsJoined] = useState(false)
	const [joinRequestPending, setJoinRequestPending] = useState(false)
	const isMounted = useMounted()
	const dispatch = useDispatch()

	useEffect(() => {
		if (loginState.loggedIn && board) {
			console.log('hit')
			let joined = loginState.info.joinedBoards
				.filter((boardId:string) => 
					boardId === (board as BoardType)._id).length ? true : false
			setIsJoined(joined)
		}
	}, [loginState, board])

	const updateFeed = useCallback(() => {
		if (!feedLoading && !feedEnded) {
			setFeedLoading(true)
			axios.get(`/api/board/${params.boardname}/feed?page=${page}&perpage=5`)
				.then(res => {
					if (isMounted()) {
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
				})
				.catch(error => {
					if (isMounted()) {
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
				})
				
		}
	}, [
		feedEnded, feedLoading,
		isMounted, page, params.boardname,
		setAlert
	])

	const fetchBoard = useCallback(() => {
		setBoardLoading(true)
		axios.get(`/api/board/${params.boardname}`)
			.then(res => {
				if (isMounted()) {
					setBoard(res.data)
					setBoardLoading(false)
					updateFeed()
				}
			})
			.catch(error => {
				if (isMounted()) {
					setBoardLoading(false)
					if (error.response) {
						// Request made and server responded (Failed to Login)
						setAlert({
							message: error.response.data.message,
							severity: 'error'
						})
						} else if (error.request) {
						// The request was made but no response was received (Slow Internet)
						setAlert({
							message: 'Failed to load comments due to slow network',
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
	}, [
		isMounted, params.boardname,
		setAlert, updateFeed
	])

	useEffect(() => {
		if (!oneShot) {
			setOneShot(true)
			fetchBoard()
		}
	}, [fetchBoard, oneShot])

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

	const handleAlertClose = () => {
		setAlert(false)
	}

	const handleJoinButton = () => {
		if (!joinRequestPending) {
			setJoinRequestPending(true)
			axios.post(`/api/board/${board?.boardName}/join`, {}, genConfig())
				.then(res => {
					if (isMounted()) {
						setJoinRequestPending(false)
					}
					dispatch(joinBoard(board))
				})
				.catch(function (error) {
					if (isMounted()) {
						setJoinRequestPending(false)
						if (error.response) {
							// Request made and server responded (Failed to Login)
							setAlert({
								message: error.response.data.message,
								severity: 'error'
							})
							} else if (error.request) {
							// The request was made but no response was received (Slow Internet)
							setAlert({
								message: 'Failed to join/;ave due to slow network',
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
			<Container>
				{boardLoading ? <LinearProgress style={{width: '100%'}}/> : (<>
					<SubContainerMain>
						<Card variant="outlined" style={{width: '100%'}}>
							<CardHeader
								avatar={
									<Avatar
										style={{width: '40xp', height: '40px'}}>
										{ (board as BoardType).boardName[0].toUpperCase() }
									</Avatar>
								}
								title={
									<Typography variant="subtitle2">
										b/{ (board as BoardType).boardName }
									</Typography>
								}
								subheader={
									<Typography variant="body2">
										{(board as BoardType).description}
									</Typography>
								}
							/>
						</Card>
						{loginState.loggedIn && <CreatePost board={params.boardname}/>}
						{feed.map((post:any) => <Post post={post} key={post._id}/>)}
						{feedLoading && <LinearProgress />}
					</SubContainerMain>
					<SubContainerAside>
						<Card elevation={1} style={{width: '100%'}}>
							<CardHeader
									avatar={
										<Avatar
											style={{width: '40xp', height: '40px'}}>
											{ (board as BoardType).boardName[0].toUpperCase() }
										</Avatar>
									}
									title={<>
										<Typography variant="subtitle2">
											b/{ (board as BoardType).boardName }
										</Typography>
									</>}
									subheader={<>
										<Typography variant="body2">
											{(board as BoardType).members} Members
										</Typography>
										<Typography variant="body2">
											{(board as BoardType).description}
										</Typography>
									</>}
								/>
								<CardContent>
									<Button 
										variant="contained"
										disableElevation
										component={Link}
										style={{marginRight: '0.25rem'}}
										to={`/submit?board=${params.boardname}`}>
											Create a Post
									</Button>
									{loginState.loggedIn && (
										<Button
											variant="contained"
											disableElevation
											onClick={handleJoinButton}
											style={{marginLeft: '0.25rem'}}>
												{
													joinRequestPending ? 'Wait' :
													isJoined ? 'Leave Board' : 'Join Board'
												}
										</Button>
									)}
								</CardContent>
						</Card>
					</SubContainerAside>
				</>)}
			</Container>
		</>)
}
