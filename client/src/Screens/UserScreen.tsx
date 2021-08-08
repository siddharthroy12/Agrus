import { useState, useCallback, useEffect } from 'react'
import axios from 'axios'
import { useParams } from 'react-router'
import {
	LinearProgress, Card, CardHeader,
	Avatar, Typography, Paper, Tabs, Tab
} from '@material-ui/core'
import {
	Container, SubContainerMain, SubContainerAside,
	Post, Comment, Board
} from '../Components'
import { useDispatch, useSelector } from 'react-redux'
import { StateType } from '../Store'
import {
	useMounted, useOnMount, useEndScroll
} from '../Hooks'
import {
	reqErrorHandler, getHumanReadableDate,
	genConfig
} from '../Utils'
import styled from 'styled-components'

const List = styled.div`
	> * {
		margin-bottom: 1rem;
	}
`
const Wrapper = styled(Container)`
	display: flex;
	flex-direction: column;
`

type UserType = {
	username: string,
	avatar: string,
	createdAt:string,
	isAdmin: boolean
}

export default function UserScreen() {
	const params:any = useParams()
	const isMounted = useMounted()
	const [user, setUser] = useState<UserType | null>(null)
	const loginState:any = useSelector((state:StateType) => state.login)
	const joinedBoardsState = useSelector((state:StateType) => state.joinedBoards)
	const [tab, setTab] = useState(0)
	const [posts, setPosts] = useState<any[]>([])
	const [comments, setComments] = useState<any[]>([])
	const [savedPosts, setSavedPosts] = useState<any[]>([])
	const [postsUpdating, setPostsUpdating] = useState(false)
	const [commentsUpdating, setCommentsUpdating] = useState(false)
	const [savedPostsUpdating, setSavedPostsUpdating] = useState(false)
	const [postsPage, setPostsPage] = useState(1)
	const [commentsPage, setCommentsPage] = useState(1)
	const [postsEnded, setPostsEnded] = useState(false)
	const [commentsEnded, setCommentsEnded] = useState(false)
	const [userLoading, setUserLoading] = useState(false)
	const dispatch = useDispatch()

	const updateSavedPosts = useCallback(() => {
		if (!savedPostsUpdating) {
			setSavedPostsUpdating(true)
			axios.get('/api/user/savedposts/get', genConfig())
				.then(res => {
					if (isMounted()) {
						setSavedPosts(res.data)
						setSavedPostsUpdating(false)
					}
				})
				.catch(error => {
					if (isMounted()) {
						reqErrorHandler(error, 'Failed to get saved posts due to slow network', dispatch)
						setUserLoading(false)
					}
				})
		}
	}, [savedPostsUpdating, dispatch, isMounted])

	const updatePosts = useCallback(() => {
		if (!postsUpdating && !postsEnded) {
			setPostsUpdating(true)
			axios.get(`/api/user/${params.username}/posts?page=${postsPage}&perpage=5`)
				.then(res => {
					if (isMounted()) {
						if (res.data.length === 0) {
							setPostsEnded(true)
						}
						setPosts((prevPosts:any) => {
							if (prevPosts[0] && res.data[0]) {
								if (prevPosts[0]._id === res.data[0]._id) {
									return prevPosts
								}
							}
							return [...prevPosts, ...res.data ]
						})
						setPostsPage(page => page + 1)
						setPostsUpdating(false)
					}
				})
				.catch(error => {
					if (isMounted()) {
						reqErrorHandler(
							error,
							'Failed to load posts due to slow network',
							dispatch
						)
						setPostsUpdating(false)
					}
				})
		}

	}, [
		postsUpdating, dispatch, isMounted,
		params.username, postsEnded, postsPage
	])

	const updateComments = useCallback(() => {
		if (!commentsUpdating && !commentsEnded) {
			setCommentsUpdating(true)
			axios.get(`/api/user/${params.username}/comments?page=${commentsPage}&perpage=5`)
				.then(res => {
					if (isMounted()) {
						if (res.data.length === 0) {
							setCommentsEnded(true)
						}
						setComments((prevComments:any) => {
							if (prevComments[0] && res.data[0]) {
								if (prevComments[0]._id === res.data[0]._id) {
									return prevComments
								}
							}
							return [...prevComments, ...res.data ]
						})
						setCommentsPage(page => page + 1)
						setCommentsUpdating(false)
					}
				})
				.catch(error => {
					if (isMounted()) {
						reqErrorHandler(
							error,
							'Failed to load comments due to slow network',
							dispatch
						)
						setCommentsUpdating(false)
					}
				})
		}
	}, [
		commentsUpdating, commentsEnded, dispatch,
		isMounted, params.username, commentsPage
	])

	const updatePostsOnScroll = useCallback(() => {
		if (loginState.loggedIn) {
			updatePosts()
		}
	}, [updatePosts, loginState.loggedIn])

	const updateCommentsOnScroll = useCallback(() => {
		if (loginState.loggedIn) {
			updateComments()
		}
	}, [updateComments, loginState.loggedIn])

	const getUser = useCallback(() => {
		if (!userLoading) {
			setUserLoading(true)
			axios.get(`/api/user/${params.username}`)
				.then(res => {
					if (isMounted()) {
						setUser(res.data)
						if (loginState.loggedIn) {
							if (loginState.info.username === params.username) {
								updateSavedPosts()
							}
						}
						updatePosts()
						updateComments()
						setUserLoading(false)
					}
				})
				.catch(error => {
					if (isMounted()) {
						reqErrorHandler(error, 'Failed to get user due to slow network', dispatch)
						setUserLoading(false)
					}
				})
		}
	},[
		params.username, dispatch,
		userLoading, isMounted, updateSavedPosts,
		updatePosts, loginState,
		updateComments
	])

	useOnMount(getUser)
	useEndScroll(updatePostsOnScroll)
	useEndScroll(updateCommentsOnScroll)

	// Switch to different tab if logged out
	useEffect(() => {
		if (!loginState.loggedIn && tab > 1) {
			setTab(1)
		}
	}, [loginState, tab])

	return (
		<Container>
			{userLoading && (<>
				<Wrapper>
					<LinearProgress />
				</Wrapper>
			</>)}
			{!userLoading && user && (<>
				<SubContainerMain>
					<Card variant="outlined" style={{width: '100%'}}>
						<CardHeader
							avatar={
								<Avatar
									src={(user as UserType).avatar}
									style={{width: '40xp', height: '40px'}}>
									{(user as UserType).username[0].toUpperCase()}
								</Avatar>
							}
							title={
								<Typography variant="subtitle2">
									u/{ (user as UserType).username }
								</Typography>
							}
							subheader={
								<Typography variant="body2">
									Joined At {getHumanReadableDate((user as UserType).createdAt)}
								</Typography>
							}
						/>
					</Card>
					<Paper>
						<Tabs
							value={tab}
							indicatorColor="primary"
							textColor="primary"
							onChange={(event:any,value) => setTab(value)}
							aria-label="User stuffs"
						>
							<Tab label="Posts" />
							<Tab label="Comments"/>
							{loginState.loggedIn && loginState.info.username === params.username &&
								<Tab label="Saved" />
							}
							{loginState.loggedIn && loginState.info.username === params.username &&
								<Tab label="Joined Boards" />
							}
						</Tabs>
					</Paper>
					<List>
						{tab === 0 && (<>
							{posts.map(post => <Post post={post} key={post._id}/>)}
							{postsUpdating && <LinearProgress />}
						</>)}
						{tab === 1 && (<>
							{comments.map(comment => <Comment comment={comment} key={comment._id}/>)}
							{commentsUpdating && <LinearProgress />}
						</>)}
						{tab === 2 && (<>
							{savedPostsUpdating && <LinearProgress />}
							{savedPosts.map(post => <Post post={post}/>)}
						</>)}
						{tab === 3 && (<>
							{joinedBoardsState.loading && <LinearProgress />}
							{joinedBoardsState.data.map((board:any) => <Board board={board} key={board._id}/>)}
						</>)}
					</List>
				</SubContainerMain>
				<SubContainerAside>
				</SubContainerAside>
			</>)}
		</Container>
	)
}
