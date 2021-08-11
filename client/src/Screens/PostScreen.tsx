import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { useParams } from 'react-router'
import Container from '../Components/Container'
import {
	Card, CardHeader, IconButton, CardMedia, Paper, Button,
	Avatar, Typography, LinearProgress, TextField
} from '@material-ui/core'
import { 
	PostType, HeaderText, PostContent, PostTitle,
	BoardName, MediaContainer, PostActions,
	DownvoteIcon, SaveIcon, UpvoteIcon, PlainLink
} from '../Components/Post'
import Alert from '../Components/Alert'
import {
	TrashIcon
} from '../Components/Comment'
import Comment from '../Components/Comment'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router'
import { 
	upvotePost, downvotePost, savePost
} from '../Actions/postActions'
import { getAndCacheUser } from '../Actions/usersCacheActions'
import { getAndCacheBoard } from '../Actions/boardsCacheActions'
import reqErrorHandler from '../Utils/reqErrorHandler'
import genConfig from '../Utils/genConfig'
import getHumanReadableDate from '../Utils/getHumanReadableDate'
import {
	useOnMount, useMounted, useEndScroll
} from '../Hooks'
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
	margin-top: 1rem;
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

const CommentSection = styled.div`
	margin-top: 1rem;
	> * {
		margin-bottom: 1rem;
	}
`

export default function PostScreen() {
	const [page, setPage] = useState(1)
	const [oneShotForComments, setOneShotForComments] = useState(false)
	const params:any = useParams()
	const [postLoading, setPostLoading] = useState(true)
	const loginState:any = useSelector<StateType>(state => state.login)
	const usersCacheState:any = useSelector<StateType>(state => state.usersCache)
	const boardsCacheState:any = useSelector<StateType>(state => state.boardsCache)
	const [cacheUserOneTime, setCacheUserOneTime] = useState(false)
	const [cacheBoardOneTime, setCacheBoardOneTime] = useState(false)
	const [saveRequestPending, setSaveRequestPending] = useState(false)
	const [voteRequestPending, setVoteRequestPending] = useState(false)
	const [commentPostRequestPending, setCommentPostRequestPending] = useState(false)
	const [comment, setComment] = useState('')
	const [comments, setComments] = useState([])
	const [postedComments, setPostedComments] = useState([])
	const [post, setPost] = useState<PostType | null>(null)
	const [commentFeedLoading, setCommentFeedLoading] = useState(false)
	const [commentFeedEnded, setCommentFeedEnded] = useState(false)
	const [deleteRequestPending, setDeleteRequestPending] = useState(false)
	const [deleted, setDeleted] = useState(false)
	const isMounted = useMounted()
	const dispatch = useDispatch()
	const history = useHistory()

	const fetchPost = useCallback(() => {
		axios.get(`/api/post/${params.id}`)
			.then(res => {
				if (isMounted()) {
					setPost(res.data)
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

	useOnMount(fetchPost)

	const isUpvoted = () => {
		if (loginState.loggedIn) {
			const upvoted = loginState.info.upvotedPosts.filter(
				(id:string) => id === (post as PostType)._id
			)
			return upvoted.length > 0 ? true : false
		} else {
			return false
		}
	}

	const isDownvoted = () => {
		if (loginState.loggedIn) {
			const downvoted = loginState.info.downvotedPosts.filter(
				(id:string) => id === (post as PostType)._id
			)
			return downvoted.length > 0 ? true : false
		} else {
			return false
		}
	}

	const isSaved = () => {
		if (loginState.loggedIn) {
			const saved = loginState.info.savedPosts.filter(
				(id:string) => id === (post as PostType)._id
			)
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
					return {
						...(prevPost as PostType),
						score: (prevPost as PostType).score - 1
					}
				})
			} else if (isDownvoted()) {
				setPost((prevPost: PostType | null) => {
					return {
						...(prevPost as PostType),
						score: (prevPost as PostType).score + 2
					}
				})
			} else {
				setPost((prevPost: PostType | null) => {
					return {
						...(prevPost as PostType),
						score: (prevPost as PostType).score + 1
					}
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
								return {
									...(prevPost as PostType),
									score: (prevPost as PostType).score + 1
								}
							})
						} else if (isDownvoted()) {
							setPost((prevPost: PostType | null) => {
								return {
									...(prevPost as PostType),
									score: (prevPost as PostType).score - 2
								}
							})
						} else {
							setPost((prevPost: PostType | null) => {
								return {
									...(prevPost as PostType),
									score: (prevPost as PostType).score - 1
								}
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
					return {
						...(prevPost as PostType),
						score: (prevPost as PostType).score + 1
					}
				})
			} else if (isUpvoted()) {
				setPost(prevPost => {
					return {
						...(prevPost as PostType),
						score: (prevPost as PostType).score - 2
					}
				})
			} else {
				setPost(prevPost => {
					return {
						...(prevPost as PostType),
						score: (prevPost as PostType).score - 1
					}
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
								return {
									...(prevPost as PostType),
									score: (prevPost as PostType).score - 1
								}
							})
						} else if (isUpvoted()) {
							setPost(prevPost => {
								return {
									...(prevPost as PostType),
									score: (prevPost as PostType).score + 2
								}
							})
						} else {
							setPost(prevPost => {
								return {
									...(prevPost as PostType),
									score: (prevPost as PostType).score + 1
								}
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
					// Undo the save if fails
					dispatch(savePost((post as PostType)._id))
					if (isMounted()) {
						setSaveRequestPending(false)
					}
				}
			)
		}
	}

	const deleteButtonHandler = () => {
		if (!deleteRequestPending) {
			setDeleteRequestPending(true)

			axios.delete(`/api/post/${(post as PostType)._id}`, genConfig())
				.then(res => {
					if (isMounted()) {
						setDeleted(true)
						setDeleteRequestPending(false)
					}
				})
				.catch(error => {
					if (isMounted()) {
						setDeleteRequestPending(false)
					}
				})
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
						setComment('')
					}
				})
				.catch(error => {
					if (isMounted()) {
						setCommentPostRequestPending(false)
						reqErrorHandler(
							error,
							'Failed to comment due to slow network',
							dispatch
							)
					}
				})
		}
	}

	const updateCommentFeed = useCallback(() => {
		if (
			!commentFeedLoading &&
			!commentFeedEnded &&
			post !== null &&
			!deleted &&
			!deleteRequestPending
		) {
			setCommentFeedLoading(true)
			axios.get(
				`/api/comment/feed/${(post as PostType)._id}?page=${page}&perpage=${5}`
			)
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
						reqErrorHandler(
							error,
							'Failed to load comments due to slow network',
							dispatch
						)
					}
				}
			)
		}
	}, [
		commentFeedEnded, commentFeedLoading,
		isMounted, page, dispatch, post, deleted,
		deleteRequestPending
	])

	useEffect(() => {
		if (post && !cacheUserOneTime) {
			if (!usersCacheState.users[post.author]) {
				dispatch(getAndCacheUser(post.author))
				setCacheUserOneTime(true)
			}
		}
	}, [post, usersCacheState, dispatch, cacheUserOneTime])

	useEffect(() => {
		if (post && !cacheBoardOneTime && post.board.trim() !== '') {
			if (!boardsCacheState.boards[post.board]) {
				dispatch(getAndCacheBoard(post.board))
				setCacheBoardOneTime(true)
			}
		}
	}, [post, boardsCacheState, dispatch, cacheBoardOneTime])

	useEffect(() => {
		if (!oneShotForComments && post !== null) {
			updateCommentFeed()
			setOneShotForComments(true)
		}
	}, [oneShotForComments, updateCommentFeed, post])

	let avatarSrc = ''
	if (post) {
		avatarSrc = usersCacheState.users[(post as any).author] && 
			!usersCacheState.users[(post as any).author].pending ?
			usersCacheState.users[(post as any).author].avatar : ''
	}
	

	useEndScroll(updateCommentFeed)

	return (
		<Wrapper>
			{postLoading ? (
				<LinearProgress />
			) : post && (
					<>
						<Card variant="outlined" style={{width: '100%'}}>
							{deleted ? (<>
								<Alert 
									severity={'error'}
									message={'Deleted'}
								/>
							</>) : deleteRequestPending ? (<>
								<Alert 
									severity={'error'}
									message={'Deleting'}
								/>
							</>) : (<>
								<CardHeader
									avatar={
										<IconButton
											size="small"
											onClick={() => history.push(`/u/${post.author}`)}
										>
											<Avatar
												src={avatarSrc}
												style={{width: '40xp', height: '40px'}}>
													{ (post as PostType).author[0].toUpperCase() }
											</Avatar>
										</IconButton>
									}
									title={
										<HeaderText>
											{ post.board !== '' && (
												<>
													<PlainLink to={`/b/${post.board}`}>
														<BoardName>
															{ post.board }
														</BoardName>
													</PlainLink>
													<Typography>
														•
													</Typography>
												</>
												)}
											<PlainLink to={`/u/${post.author}`}>
												<Typography>
													{ post.author }
												</Typography>
											</PlainLink>
										</HeaderText>
									}
									subheader={
										<Typography variant="body2">
											Posted At {getHumanReadableDate((post as PostType).createdAt)}
										</Typography>
									}
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
							{(post as PostType).type === 'image' && (
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
							{(post as PostType).type === 'video' && (
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
									<UpvoteIcon $upvoted={isUpvoted()} />
								</IconButton>
								<Typography>
									{ (post as PostType).score }
								</Typography>
								<IconButton size="small" onClick={downvoteButtonHandler}>
									<DownvoteIcon $downvoted={isDownvoted()} />
								</IconButton>
								<IconButton size="small" onClick={saveButtonHandler}>
									<SaveIcon $saved={isSaved()} />
								</IconButton>
								{loginState.loggedIn && loginState.info.username === post.author && (
									<IconButton size="small" onClick={deleteButtonHandler}>
										<TrashIcon />
									</IconButton>
								)}
							</PostActions>
							</>)}
					</Card>
					{loginState.loggedIn && !deleted && !deleteRequestPending && (<>
						<CommentBox variant="outlined">
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
					</>)}
					{!deleted && !deleteRequestPending && (
						<CommentSection>
							{postedComments.map(comment => (
								<Comment comment={comment} key={(comment as any)._id}/>
							))}
							{comments.map(comment => (
								<Comment comment={comment} key={(comment as any)._id}/>
							))}
							{commentFeedLoading && <LinearProgress />}
						</CommentSection>
					)}
				</>
			)}
		</Wrapper>
	)
}
