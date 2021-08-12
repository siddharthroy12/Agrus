import { useState, useCallback } from 'react'
import axios from 'axios'
import {
	LinearProgress, Typography, Divider,
	TextField
} from '@material-ui/core'
import { PostType } from '../Components/Post'
import { useParams, useHistory } from 'react-router'
import {
	Container, SubContainerMain, ButtonPrimary, SubContainerAside
} from '../Components'
import { useMounted, useOnMount } from '../Hooks'
import { useDispatch } from 'react-redux'
import { reqErrorHandler, genConfig } from '../Utils'
import {Helmet} from 'react-helmet'

export default function UpdatePostScreen() {
	const params:{ id: string } = useParams()
	const [post, setPost] = useState<PostType | null>()
	const [title, setTitle] = useState('')
	const [body, setBody] = useState('')
	const [postLoading, setPostLoading] = useState(false)
	const [editPostRequestPending, setEditPostRequestPending] = useState(false)
	const dispatch = useDispatch()
	const isMounted = useMounted()
	const history = useHistory()

	const fetchPost = useCallback(() => {
		setPostLoading(true)
		axios.get(`/api/post/${params.id}`)
			.then(res => {
				if (isMounted()) {
					setPost(res.data)
					setTitle(res.data.title)
					setBody(res.data.body)
					setPostLoading(false)
				}
			})
			.catch(error => {
				if (isMounted()) {
					setPostLoading(false)
					reqErrorHandler(
						error,
						'Failed to load post due to slow network',
						dispatch
					)
				}
			})
	}, [dispatch, params.id, isMounted])

	const editPost = () => {
		if (!editPostRequestPending) {
			setEditPostRequestPending(true)
			axios.put(`/api/post/${post?._id}`, { title, body }, genConfig())
				.then(res => {
					if (isMounted()) {
						history.push(`/post/${post?._id}`)
					}
				})
				.catch(error => {
					if (isMounted()) {
						setEditPostRequestPending(false)
						reqErrorHandler(
							error,
							'Failed to edit post due to slow network',
							dispatch
						)
					}
				})
		}
	}

	useOnMount(fetchPost)

	return (
		<Container>
			<Helmet>
				<title>
					Edit Post
				</title>
			</Helmet>
			{postLoading && <LinearProgress style={{width: '100%'}}/>}
			{!postLoading && post && (<>
				<SubContainerMain>
					<Typography variant="h6" component="h2">
						Edit Post
					</Typography>
					<Divider style={{marginBottom: '1rem'}}/>
					<TextField
						id="filled-basic"
						label="Title" 
						variant="filled"
						value={title}
						disabled={editPostRequestPending}
						style={{width: '100%'}}
						onChange={e => setTitle(e.target.value)}
					/>
					{post.type === 'text' && (
						<TextField
							id="filled-basic"
							label="Body"
							variant="filled"
							multiline rows={8}
							disabled={editPostRequestPending}
							value={body}
							style={{width: '100%'}}
							onChange={e => setBody(e.target.value)}
						/>
					)}
					
					<ButtonPrimary
						color="primary"
						disabled={editPostRequestPending}
						variant="contained"
						onClick={editPost}
					>
						Save
					</ButtonPrimary>
				</SubContainerMain>
				<SubContainerAside>
					
				</SubContainerAside>
			</>)}
		</Container>
	)
}
