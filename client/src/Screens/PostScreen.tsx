import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { useParams } from 'react-router'
import Container from '../Components/Container'

import {
	Card, CardHeader, IconButton, CardMedia, Paper, Button,
	Avatar, Typography, Snackbar, LinearProgress, TextField
} from '@material-ui/core'

import { 
	PostType, HeaderText, PostContent, PostTitle,
	BoardName, getHumanReadableDate, MediaContainer,
	PostActions, DownvoteIcon, SaveIcon, UpvoteIcon
} from '../Components/Post'

import Comment from '../Components/Comment'

import Alert from '../Components/Alert'

import { useSelector, useDispatch } from 'react-redux'

import { 
	upvotePost,
	downvotePost,
	savePost
} from '../Actions/postActions'

import genConfig from '../Utils/genConfig'

import useMounted from '../Hooks/useMounted'
import useAlert, { AlertType } from '../Hooks/useAlert'

import { StateType } from '../Store'

import styled from 'styled-components'

const PostBody = styled(Typography)`
	color: #505050;
	overflow: hidden;
`

const Wrapper = styled(Container)`
	display: flex;
	flex-direction: column;
`

const CommentBox = styled(Paper)`
	margin: 1rem 0;
	padding: 1rem;
`

const CommentBoxActions = styled.div`
	display: flex;
	padding-top: 1rem;
	flex-direction: row-reverse;
`

const PostCommentButton = styled(Button)`
	background-color: ${(props) => props.theme.primary};
	color: white;
`

const PostField = styled(TextField)`
	width: 100%;
`

export default function PostScreen() {
	const [page, setPage] = useState(1)
	const [oneShotForPost, setOneShotForPost] = useState(false)
	const [oneShotForComments, setOneShotForComments] = useState(false)
	const params:any = useParams()
	const [postLoading, setPostLoading] = useState(true)
	const [alert, setAlert] = useAlert(false)
	const loginState:any = useSelector<StateType>(state => state.login)
	const [saveRequestPending, setSaveRequestPending] = useState(false)
	const [voteRequestPending, setVoteRequestPending] = useState(false)
	const [commentPostRequestPending, setCommentPostRequestPending] = useState(false)
	const [comment, setComment] = useState('')
	const [comments, setComments] = useState([])
	const [postedComments, setPostedComments] = useState([])
	const [post, setPost] = useState<PostType | null>(null)
	const [commentFeedLoading, setCommentFeedLoading] = useState(false)
	const [commentFeedEnded, setCommentFeedEnded] = useState(false)
	const isMounted = useMounted()
	const dispatch = useDispatch()

	const fetchPost = useCallback(() => {
		console.log('getting post')
		axios.get(`/api/post/${params.id}`)
			.then(res => {
				console.log(isMounted())
				
				if (isMounted()) {
					console.log({data: res.data})
					setPost(res.data)
					setPostLoading(false)
				}
			})
			.catch(error => {
				if (isMounted()) {
					setPostLoading(false)
					if (error.response) {
						// Request made and server responded (Failed to Login)
						setAlert({
							message: error.response.data.message,
							severity: 'error'
						})
						} else if (error.request) {
						// The request was made but no response was received (Slow Internet)
						setAlert({
							message: 'Failed load post due to slow network',
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
	}, [setAlert, params.id])

	// Fetch Post data on first run
	useEffect(() => {
		if (!oneShotForPost) {
			fetchPost()
			setOneShotForPost(false)
		}
	}, [fetchPost, oneShotForPost])

	const handleAlertClose = () => {
		setAlert(false)
	}

	const isUpvoted = () => {
		if (loginState.loggedIn) {
			const upvoted = loginState.info.upvotedPosts.filter((id:string) => id === (post as PostType)._id)
			return upvoted.length > 0 ? true : false
		} else {
			return false
		}
	}

	const isDownvoted = () => {
		if (loginState.loggedIn) {
			const downvoted = loginState.info.downvotedPosts.filter((id:string) => id === (post as PostType)._id)
			return downvoted.length > 0 ? true : false
		} else {
			return false
		}
	}

	const isSaved = () => {
		if (loginState.loggedIn) {
			const saved = loginState.info.savedPosts.filter((id:string) => id === (post as PostType)._id)
			return saved.length > 0 ? true : false
		} else {
			return false
		}
	}

	const upvoteButtonHandler = () => {
		if (!voteRequestPending && loginState.loggedIn) {
			setVoteRequestPending(true)
			if (isUpvoted()) {
				setPost((prevPost: PostType | null) => {
					return {...(prevPost as PostType), score: (prevPost as PostType).score - 1}
				})
			} else if (isDownvoted()) {
				setPost((prevPost: PostType | null) => {
					return {...(prevPost as PostType), score: (prevPost as PostType).score + 2}
				})
			} else {
				setPost((prevPost: PostType | null) => {
					return {...(prevPost as PostType), score: (prevPost as PostType).score + 1}
				})
			}

			dispatch(upvotePost((post as PostType)._id))
			axios.post(`/api/post/${(post as PostType)._id}/upvote`, {}, genConfig())
				.then(res => {
					if (isMounted()) {
						setVoteRequestPending(false)
					}
				}).catch(function (error) {
					dispatch(upvotePost((post as PostType)._id)) // Undo the upvote if fails
					
					if (isDownvoted()) {
						dispatch(downvotePost((post as PostType)._id))
					}
					if (isMounted()) {
						if (isUpvoted()) {
							setPost((prevPost: PostType | null) => {
								return {...(prevPost as PostType), score: (prevPost as PostType).score + 1}
							})
						} else if (isDownvoted()) {
							setPost((prevPost: PostType | null) => {
								return {...(prevPost as PostType), score: (prevPost as PostType).score - 2}
							})
						} else {
							setPost((prevPost: PostType | null) => {
								return {...(prevPost as PostType), score: (prevPost as PostType).score - 1}
							})
						}
						setVoteRequestPending(false)
					}
				}
			)
		}
	}

	const downvoteButtonHandler = () => {
		if (!voteRequestPending && loginState.loggedIn) {
			setVoteRequestPending(true)
			if (isDownvoted()) {
				setPost(prevPost => {
					return {...(prevPost as PostType), score: (prevPost as PostType).score + 1}
				})
			} else if (isUpvoted()) {
				setPost(prevPost => {
					return {...(prevPost as PostType), score: (prevPost as PostType).score - 2}
				})
			} else {
				setPost(prevPost => {
					return {...(prevPost as PostType), score: (prevPost as PostType).score - 1}
				})
			}
			dispatch(downvotePost((post as PostType)._id))
			axios.post(`/api/post/${(post as PostType)._id}/downvote`, {}, genConfig())
				.then(res => {
					if (isMounted()) {
						setVoteRequestPending(false)
					}
				}).catch(function (error) {
					dispatch(downvotePost((post as PostType)._id)) // Undo the downvote if fails
					if (isUpvoted()) {
						dispatch(upvotePost((post as PostType)._id))
					}
					if (isMounted()) {
						if (isUpvoted()) {
							setPost(prevPost => {
								return {...(prevPost as PostType), score: (prevPost as PostType).score - 1}
							})
						} else if (isUpvoted()) {
							setPost(prevPost => {
								return {...(prevPost as PostType), score: (prevPost as PostType).score + 2}
							})
						} else {
							setPost(prevPost => {
								return {...(prevPost as PostType), score: (prevPost as PostType).score + 1}
							})
						}
						setVoteRequestPending(false)
					}
				}
			)
		}
	}

	const saveButtonHandler = () => {
		if (!saveRequestPending && loginState.loggedIn) {
			setSaveRequestPending(true)

			dispatch(savePost((post as PostType)._id))
			axios.post(`/api/post/${(post as PostType)._id}/save`, {}, genConfig())
				.then(res => {
					if (isMounted()) {
						setSaveRequestPending(false)
					}
				}).catch(function (error) {
					dispatch(savePost((post as PostType)._id)) // Undo the save if fails
					if (isMounted()) {
						setSaveRequestPending(false)
					}
				}
			)
		}
	}

	const postComment = () => {
		if (!commentPostRequestPending) {
			setCommentPostRequestPending(true)

			const reqBody = {
				body: comment,
				post: params.id
			}

			axios.post(`/api/comment`, reqBody, genConfig())
				.then(res => {
					if (isMounted()) {
						setCommentPostRequestPending(false)
						setPostedComments((prevComments) => {
							let copy = [...prevComments]
							copy.push((res.data as never)) // Weird type cast
							return copy
						})
					}
				})
				.catch(error => {
					if (isMounted()) {
						setCommentPostRequestPending(false)
						if (error.response) {
							// Request made and server responded (Failed to Login)
							setAlert({
								message: error.response.data.message,
								severity: 'error'
							})
							} else if (error.request) {
							// The request was made but no response was received (Slow Internet)
							setAlert({
								message: 'Failed to comment due to slow network',
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

	const updateCommentFeed = useCallback(() => {
		if (!commentFeedLoading && !commentFeedEnded && post !== null) {
			setCommentFeedLoading(true)
			axios.get(`/api/comment/feed/${(post as PostType)._id}?page=${page}&perpage=${5}`)
				.then(res => {
					if (isMounted()) {
							if (res.data.length === 0) {
								setCommentFeedEnded(true)
							}
								// @ts-ignore
							setComments((prevComments) => {
								return [...prevComments, ...res.data ]
							})
							setPage(page => page + 1)
							setCommentFeedLoading(false)
					}
				}).catch(function (error) {
					if (isMounted()) {
						setCommentFeedLoading(false)
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
				}
			)
		}
	}, [
		commentFeedEnded, commentFeedLoading,
		isMounted, page, setAlert, post
	])

	useEffect(() => {
		if (!oneShotForComments && post !== null) {
			updateCommentFeed()
			setOneShotForComments(true)
		}
	}, [oneShotForComments, updateCommentFeed, post])

	useEffect(() => { // If Update function changes reapply the event listner
		const onScrollCheck = () => {
			// When on end of the page
			if (
				(window.innerHeight + window.scrollY) 
				>= window.document.body.offsetHeight) {
					updateCommentFeed()
			}
		}

		window.addEventListener('scroll', onScrollCheck)

		return () => {
			window.removeEventListener('scroll', onScrollCheck)
		}
	}, [updateCommentFeed])


	// Removing this line seems to break the app because of quantum mechanics (maybe)
	//console.log({ postLoading, post})

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
			<Wrapper>
				{postLoading ? (
					<LinearProgress />
				) : post && (
						<>
							<Card elevation={1} style={{width: '100%'}}>
							<CardHeader
								avatar={
									<IconButton size="small">
										<Avatar
											style={{width: '40xp', height: '40px'}}>
												{ (post as PostType).author[0].toUpperCase() }
										</Avatar>
									</IconButton>
								}
								title={
									<HeaderText	>
										{ (post as PostType).board !== '' ? (
											<>
												<BoardName>
													{ (post as PostType).board }
												</BoardName>
												<Typography>
													•
												</Typography>
											</>
										): null}
											<Typography>
												{ (post as PostType).author }
											</Typography>
									</HeaderText>
								}
								subheader={getHumanReadableDate((post as PostType).createdAt)}
							/>
							<PostContent>
									<PostTitle>
										{ (post as PostType).title }
									</PostTitle>
									{ (post as PostType).type === 'text' && (
										<PostBody>
											{ (post as PostType).body }
										</PostBody>
									)}
							</PostContent>
							{ (post as PostType).type === 'image' && (
								<MediaContainer>
									<CardMedia
										component="img"
										alt="bruh"
										style={{height: '25rem', width: 'auto'}}
										image={(post as PostType).media}
										title="image"
									/>
								</MediaContainer>
							)}
							{ (post as PostType).type === 'video' && (
								<MediaContainer>
									<CardMedia
										component="video"
										style={{ width: '100%'}}
										controls
										src={(post as PostType).media}
										title="video"
									/>
								</MediaContainer>
							)}
							<PostActions>
								<IconButton size="small" onClick={upvoteButtonHandler}>
									<UpvoteIcon upvoted={isUpvoted()} />
								</IconButton>
								<Typography>
									{ (post as PostType).score }
								</Typography>
								<IconButton size="small" onClick={downvoteButtonHandler}>
									<DownvoteIcon downvoted={isDownvoted()} />
								</IconButton>
								<IconButton size="small" onClick={saveButtonHandler}>
									<SaveIcon saved={isSaved()} />
								</IconButton>
							</PostActions>
						</Card>
						<CommentBox>
							<PostField
								id="filled-basic"
								label="Post a comment"
								variant="filled"
								value={comment}
								onChange={(e:any) => setComment(e.target.value)}
								multiline
							/>
							<CommentBoxActions>
								<PostCommentButton
									variant="contained"
									color="primary"
									disabled={commentPostRequestPending}
									onClick={postComment}>
										Post
								</PostCommentButton>
							</CommentBoxActions>
						</CommentBox>
						{postedComments.map(comment => <Comment comment={comment} />)}
						{comments.map(comment => <Comment comment={comment} />)}
					</>
				)}
			</Wrapper>
		</>
	)
}
