import { useState, useCallback, useEffect } from 'react'
import { useParams } from 'react-router'
import axios from 'axios'
import {
	Typography, Card, CardHeader, CardContent,
	LinearProgress, Avatar
} from '@material-ui/core'
import { useSelector, useDispatch } from 'react-redux'
import { StateType } from '../Store'
import { joinBoard } from '../Actions/boardActions'
import genConfig from '../Utils/genConfig'
import { Link } from 'react-router-dom'
import {
	Container, SubContainerMain, SubContainerAside,
	CreatePost, Post, ButtonPrimary, ButtonSecondary
} from '../Components'
import {
	useMounted, useOnMount, useEndScroll
} from '../Hooks'
import reqErrorHandler from '../Utils/reqErrorHandler'
import styled from 'styled-components'

const BoardActionsContainer = styled.div`
	display: flex;
	flex-wrap: wrap;

	> * {

	}
`

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
	const [board, setBoard] = useState<BoardType | null>(null)
	const [boardLoading, setBoardLoading] = useState(true)
	const [isJoined, setIsJoined] = useState(false)
	const [joinRequestPending, setJoinRequestPending] = useState(false)
	const isMounted = useMounted()
	const dispatch = useDispatch()

	useEffect(() => {
		if (loginState.loggedIn && board) {
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
							setFeed((prevFeed:any) => {
								if (prevFeed[0] && res.data[0]) {
									if (prevFeed[0]._id === res.data[0]._id) {
										return prevFeed
									}
								}
								return [...prevFeed, ...res.data ]
							})
							setPage(page => page + 1)
							setFeedLoading(false)
					}
				})
				.catch(error => {
					if (isMounted()) {
						setFeedLoading(false)
						reqErrorHandler(
							error,
							'Failed to load posts due to slow network',
							dispatch
						)
					}
				})
				
		}
	}, [
		feedEnded, feedLoading,
		isMounted, page, params.boardname,
		dispatch
	])

	const updateFeedOnScroll = useCallback(() => {
		if (board) {
			updateFeed()
		}
	}, [board, updateFeed])

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
					reqErrorHandler(
						error,
						'Failed to load board due to slow network',
						dispatch
					)
				}
			})
	}, [
		isMounted, params.boardname,
		dispatch, updateFeed
	])

	useOnMount(fetchBoard)
	useEndScroll(updateFeedOnScroll)

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
					reqErrorHandler(
						error,
						'Failed to join/leave due to slow network',
						dispatch
					)
				})
		}
	}

	return (
		<Container>
			{boardLoading ? <LinearProgress style={{width: '100%'}}/> : board && (<>
				<SubContainerMain>
					<Card variant="outlined" style={{width: '100%'}}>
						<CardHeader
							avatar={
								<Avatar
									src={(board as BoardType).logo}
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
										src={(board as BoardType).logo}
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
								<BoardActionsContainer>
									{/* @ts-ignore */}
									<ButtonPrimary component={Link}
										variant="contained"
										disableElevation
										color="primary"
										style={{marginRight: '0.25rem'}}
										to={`/submit?board=${params.boardname}`}
									>
										Create a Post
									</ButtonPrimary>
									{loginState.loggedIn && (
										<ButtonSecondary
											variant="outlined"
											disableElevation
											onClick={handleJoinButton}
											style={{marginLeft: '0.25rem'}}
										>
											{
												joinRequestPending ? 'Wait' :
												isJoined ? 'Leave Board' : 'Join Board'
											}
										</ButtonSecondary>
									)}
									{loginState.loggedIn && loginState.info._id === board.author && (<>
										{/* @ts-ignore */}
										<ButtonPrimary component={Link}
											variant="contained"
											disableElevation
											color="primary"
											style={{marginTop: '0.5rem'}}
											to={`/update/board/${params.boardname}`}
										>
											Edit Board
										</ButtonPrimary>
									</>)}
								</BoardActionsContainer>
							</CardContent>
					</Card>
				</SubContainerAside>
			</>)}
		</Container>
	)
}
