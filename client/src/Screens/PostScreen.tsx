import { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams } from 'react-router'
import Container from '../Components/Container'

import {
	Card, CardHeader, IconButton, CardMedia,
	Avatar, Typography, Snackbar, LinearProgress
} from '@material-ui/core'

import { 
	PostType, HeaderText, PostContent, PostTitle,
	BoardName, getHumanReadableDate, MediaContainer,
	PostActions, DownvoteIcon, SaveIcon, UpvoteIcon
} from '../Components/Post'

import Alert from '../Components/Alert'

import { useSelector, useDispatch } from 'react-redux'

import { 
	upvote,
	downvote,
	save
} from '../Actions/postActions'

import genConfig from '../Utils/genConfig'

import useMounted from '../Hooks/useMounted'
import useAlert, { AlertType } from '../Hooks/useAlert'

import { StateType } from '../Store'

import styled from 'styled-components'

export const PostBody = styled(Typography)`
	color: #505050;
	overflow: hidden;
`

export default function PostScreen() {
	const params:any = useParams()
	const [postLoading, setPostLoading] = useState(true)
	const [alert, setAlert] = useAlert(false)
	const loginState:any = useSelector<StateType>(state => state.login)
	const [saveRequestPending, setSaveRequestPending] = useState(false)
	const [voteRequestPending, setVoteRequestPending] = useState(false)
	const [post, setPost] = useState<PostType | null>(null)
	const mounted = useMounted()
	const dispatch = useDispatch()


	// Fetch Post data on first run
	useEffect(() => {
		const fetchPostData = () => {
			axios.get(`/api/post/${params.id}`)
				.then(res => {
					if (mounted) {
						setPost(res.data)
						setPostLoading(false)
					}
				})
				.catch(error => {
					if (mounted) {
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
		}

		fetchPostData()
	}, [mounted, params.id, setAlert])

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

			dispatch(upvote((post as PostType)._id))
			axios.post(`/api/post/${(post as PostType)._id}/upvote`, {}, genConfig())
				.then(res => {
					if (mounted) {
						setVoteRequestPending(false)
					}
				}).catch(function (error) {
					dispatch(upvote((post as PostType)._id)) // Undo the upvote if fails
					
					if (isDownvoted()) {
						dispatch(downvote((post as PostType)._id))
					}
					if (mounted) {
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
			dispatch(downvote((post as PostType)._id))
			axios.post(`/api/post/${(post as PostType)._id}/downvote`, {}, genConfig())
				.then(res => {
					if (mounted) {
						setVoteRequestPending(false)
					}
				}).catch(function (error) {
					dispatch(downvote((post as PostType)._id)) // Undo the downvote if fails
					if (isUpvoted()) {
						dispatch(upvote((post as PostType)._id))
					}
					if (mounted) {
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

			dispatch(save((post as PostType)._id))
			axios.post(`/api/post/${(post as PostType)._id}/save`, {}, genConfig())
				.then(res => {
					if (mounted) {
						setSaveRequestPending(false)
					}
				}).catch(function (error) {
					dispatch(save((post as PostType)._id)) // Undo the save if fails
					if (mounted) {
						setSaveRequestPending(false)
					}
				}
			)
		}
	}

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
				{postLoading ? (
					<LinearProgress />
				) : post && (
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
				)}
			</Container>
		</>
	)
}
