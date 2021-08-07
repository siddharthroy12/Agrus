import { useState, useCallback } from 'react'
import axios from 'axios'
import {
	Container, SubContainerMain, CreatePost,
	SubContainerAside, ButtonPrimary, Post,
} from '../Components'
import {
	Paper, Typography, 
	LinearProgress
} from '@material-ui/core'
import { Home as HomeIcon } from '@material-ui/icons'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { StateType } from '../Store'
import {
	useMounted, useEndScroll, useOnMount
} from '../Hooks'
import { useDispatch } from 'react-redux'
import reqErrorHandler from '../Utils/reqErrorHandler'
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
	margin-bottom: 1rem;
`

export default function HomeScreen() {
	const [feed, setFeed] = useState([])
	const [page, setPage] = useState(1)
	const [feedEnded, setFeedEnded] = useState(false)
	const [feedLoading, setFeedLoading] = useState(false)
	const isMounted = useMounted()
	const dispatch = useDispatch()
	const loginState:any = useSelector((state:StateType) => state.login)

	const updateFeed = useCallback(() => {
		if (!feedLoading) {
			if (!feedEnded) {
				setFeedLoading(true)
				axios.get(`/api/post/feed/get?page=${page}&perpage=${5}`)
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
					}).catch(function (error) {
						if (isMounted()) {
							setFeedLoading(false)
							reqErrorHandler(error, 'Failed to load posts to slow network', dispatch)
						}
					}
				)
			}
		}
	}, [feedLoading, page, dispatch, feedEnded, isMounted])


	useOnMount(updateFeed)
	useEndScroll(updateFeed)

	return (
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
				<PageDescriptionBox variant="outlined">
					<PageDescriptionTop>
						<HomeIcon />
						<Typography>Home</Typography>
					</PageDescriptionTop>
					<PageDescription>
						This is the front page of this site,
						you can join boards, create posts,
						interact with others and lot more, but behave properly
					</PageDescription>
					{/* @ts-ignore */}
					<ButtonPrimary component={Link}
						variant="contained"
						disableElevation
						color="primary"
						to='/submit'>
							Create a Post
					</ButtonPrimary>
				</PageDescriptionBox>
			</SubContainerAside>
		</Container>
	)
}
