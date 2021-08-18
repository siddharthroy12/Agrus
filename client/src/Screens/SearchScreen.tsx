import axios from 'axios'
import { useState, useEffect, useCallback } from 'react'
import { useLocation, useHistory } from 'react-router'
import useMounted from '../Hooks/useMounted'
import reqErrorHandler from '../Utils/reqErrorHandler'
import {
	LinearProgress, Typography, TextField
} from '@material-ui/core'
import {
	Container, Post,
	Board
} from '../Components'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'
import queryString from 'query-string'
import { Helmet } from 'react-helmet'

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
const SearchBox = styled(TextField)`
	margin-bottom: 3rem;

	@media screen and (min-width: 451px) {
		display: none !important;
	}
`

export default function SearchScreen() {
	const [loading, setLoading] = useState(false)
	const [posts, setPosts] = useState<any[]>([])
	const [boards, setBoards] = useState<any[]>([])
	const [searchText, setSearchText] = useState('')
	const isMounted = useMounted()
	const location = useLocation()
	const history = useHistory()
	const dispatch = useDispatch()

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
					reqErrorHandler(error, 'Failed to get posts due to slow network', dispatch)
				}
			})
	}, [location.search, isMounted, dispatch])

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
					reqErrorHandler(error, 'Failed to get boards due to slow network', dispatch)
				}
			})
	}, [location.search, isMounted, dispatch])

	useEffect(() => {
		if (queryString.parse(location.search).search) {
			setLoading(true)
			searchPosts()
			searchBoards()
		}
	},[location.search, searchPosts, searchBoards])

	useEffect(() => {
		setSearchText(queryString.parse(location.search).search as string)
	}, [location.search])
	
	const handleSearchBoxChange = (event:any) => {
		setSearchText(event.target.value)
		if (event.target.value.trim().length > 2) {
			history.push(
				`/search?search=${encodeURIComponent(event.target.value.trim())}`
			)
		}
	}

	return (
		<Wrapper>
			<Helmet>
				<title>
					Search Result for {`"${queryString.parse((location.search)).search}"`}
				</title>
				<meta
          name="description"
          content={`Search Result for "${queryString.parse((location.search)).search}"`}
        />
			</Helmet>
			<SearchBox
				variant="filled"
				label="Search"
				value={searchText}
				onChange={handleSearchBoxChange}
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
