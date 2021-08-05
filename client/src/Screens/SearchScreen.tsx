import axios from 'axios'
import { useState, useEffect, useCallback } from 'react'
import { useLocation } from 'react-router'
import useMounted from '../Hooks/useMounted'
import useAlert, { AlertType } from '../Hooks/useAlert'
import {
	LinearProgress, Typography
} from '@material-ui/core'

import {
	Container, AlertDisplay, Post,
	Board
} from '../Components'

import styled from 'styled-components'

const Loading = styled(LinearProgress)`
	width: 100%;
`
const SubHeader = styled(Typography)`
	margin-bottom: 1rem;
`
const List = styled.div`
	> * {
		margin-bottom: 1rem;
	}
`

const Wrapper = styled(Container)`
	display: flex;
	flex-direction: column;
`


export default function SearchScreen() {
	const [loading, setLoading] = useState(false)
	const [posts, setPosts] = useState<any[]>([])
	const [boards, setBoards] = useState<any[]>([])
	const [alert, setAlert] = useAlert(false)
	const isMounted = useMounted()
	const location = useLocation()

	const searchPosts = useCallback(() => {
		axios.get(`/api/post/search/get${location.search}`)
			.then(res => {
				if (isMounted()) {
					setLoading(false)
					setPosts(res.data)
				}
			})
			.catch(function (error) {
				if (isMounted()) {
					setLoading(false)
					if (error.response) {
						// Request made and server responded (Failed to Login)
						setAlert({
							message: error.response.data.message,
							severity: 'error'
						})
						} else if (error.request) {
						// The request was made but no response was received (Slow Internet)
						setAlert({
							message: 'Failed to get posts due to slow network',
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
	}, [location.search, isMounted, setAlert])

	const searchBoards = useCallback(() => {
		axios.get(`/api/board/search/get${location.search}`)
			.then(res => {
				if (isMounted()) {
					setLoading(false)
					setBoards(res.data)
				}
			})
			.catch(function (error) {
				if (isMounted()) {
					setLoading(false)
					if (error.response) {
						// Request made and server responded (Failed to Login)
						setAlert({
							message: error.response.data.message,
							severity: 'error'
						})
						} else if (error.request) {
						// The request was made but no response was received (Slow Internet)
						setAlert({
							message: 'Failed to boards due to slow network',
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
	}, [location.search, isMounted, setAlert])

	useEffect(() => {
		setLoading(true)
		searchPosts()
		searchBoards()
		
	},[location.search, searchPosts, searchBoards ])
	return (
		<Wrapper>
			<AlertDisplay
				alert={alert as AlertType}
				setAlert={setAlert}
			/>
				{loading && <Loading />}
				{!loading && (<>
					<SubHeader variant="h6">Posts</SubHeader>
					<List>
						{posts.map(post => <Post post={post} key={post._id}/>)}
					</List>
					{posts.length < 1  && <Typography>No Post Found</Typography>}
				</>)}
				{!loading && (<>
					<SubHeader variant="h6">Boards</SubHeader>
					<List>
						{boards.map(board => <Board board={board} key={board._id}/>)}
					</List>
					{boards.length < 1  && <Typography>No Post Found</Typography>}
				</>)}
		</Wrapper>
	)
}
