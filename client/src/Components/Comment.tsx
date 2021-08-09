import { useState } from 'react'
import {
	Card, CardHeader,	Avatar,
	IconButton, Typography,
} from '@material-ui/core'
import {
	Delete as DeleteIcon
} from '@material-ui/icons'
import axios from 'axios'
import { 
 	HeaderText, PostActions as CommentActions,
	DownvoteIcon, UpvoteIcon,
	PostContent as CommentContent,
} from './Post'
import styled from 'styled-components'
import { useSelector, useDispatch } from 'react-redux'
import { StateType } from '../Store'
import {
	upvoteComment,
	downvoteComment,
} from '../Actions/commentActions'
import { useHistory } from 'react-router'
import {
	PlainLink
} from './Post'
import Alert from './Alert'
import genConfig from '../Utils/genConfig'
import useMounted from '../Hooks/useMounted'
import getHumanReadableDate from '../Utils/getHumanReadableDate'

export const TrashIcon = styled(DeleteIcon)`
	color: ${(props) => props.theme.fontColor};
`
const CommentBody = styled(Typography)`
	color: #505050;
	overflow: hidden;
`

type CommentType = {
	_id: string,
	author: string,
	parentPost: string,
	body: string,
	score: number,
	createdAt: string,
}

type PropsType = {
	comment: CommentType
}

export default function Comment({ comment: _comment }: PropsType) {
	const [comment, setComment] = useState(_comment)
	const [voteRequestPending, setVoteRequestPending] = useState(false)
	const [deleted, setDeleted] = useState(false)
	const loginState:any = useSelector<StateType>(state => state.login)
	const [deleteRequestPending, setDeleteRequestPending] = useState(false)
	const isMounted = useMounted()
	const dispatch = useDispatch()
	const history = useHistory()

	const isUpvoted = () => {
		if (loginState.loggedIn) {
			const upvoted = loginState.info.upvotedComments.filter(
				(id:string) => id === comment._id
			)
			return upvoted.length > 0 ? true : false
		} else {
			return false
		}
	}

	const isDownvoted = () => {
		if (loginState.loggedIn) {
			const downvoted = loginState.info.downvotedComments.filter(
				(id:string) => id === comment._id
			)
			return downvoted.length > 0 ? true : false
		} else {
			return false
		}
	}

	const upvoteButtonHandler = () => {
		if (!voteRequestPending && loginState.loggedIn) {
			setVoteRequestPending(true)
			if (isUpvoted()) {
				setComment(prevComment => {
					return {...prevComment, score: prevComment.score - 1}
				})
			} else if (isDownvoted()) {
				setComment(prevComment => {
					return {...prevComment, score: prevComment.score + 2}
				})
			} else {
				setComment(prevComment => {
					return {...prevComment, score: prevComment.score + 1}
				})
			}

			dispatch(upvoteComment(comment._id))
			axios.post(`/api/comment/${comment._id}/upvote`, {}, genConfig())
				.then(res => {
					if (isMounted()) {
						setVoteRequestPending(false)
					}
				}).catch(function (error) {
					dispatch(upvoteComment(comment._id)) // Undo the upvote if fails
					
					if (isDownvoted()) {
						dispatch(downvoteComment(comment._id))
					}
					if (isMounted()) {
						if (isUpvoted()) {
							setComment(prevComment => {
								return {...prevComment, score: prevComment.score + 1}
							})
						} else if (isDownvoted()) {
							setComment(prevComment => {
								return {...prevComment, score: prevComment.score - 2}
							})
						} else {
							setComment(prevComment => {
								return {...prevComment, score: prevComment.score - 1}
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
				setComment(prevComment => {
					return {...prevComment, score: prevComment.score + 1}
				})
			} else if (isUpvoted()) {
				setComment(prevComment => {
					return {...prevComment, score: prevComment.score - 2}
				})
			} else {
				setComment(prevComment => {
					return {...prevComment, score: prevComment.score - 1}
				})
			}
			dispatch(downvoteComment(comment._id))
			axios.post(`/api/comment/${comment._id}/downvote`, {}, genConfig())
				.then(res => {
					if (isMounted()) {
						setVoteRequestPending(false)
					}
				}).catch(function (error) {
					dispatch(downvoteComment(comment._id)) // Undo the downvote if fails
					if (isUpvoted()) {
						dispatch(upvoteComment(comment._id))
					}
					if (isMounted()) {
						if (isUpvoted()) {
							setComment(prevComment => {
								return {...prevComment, score: prevComment.score - 1}
							})
						} else if (isUpvoted()) {
							setComment(prevComment => {
								return {...prevComment, score: prevComment.score + 2}
							})
						} else {
							setComment(prevComment => {
								return {...prevComment, score: prevComment.score + 1}
							})
						}
						setVoteRequestPending(false)
					}
				}
			)
		}
	}

	const deleteButtonHandler = () => {
		if (!deleteRequestPending) {
			setDeleteRequestPending(true)

			axios.delete(`/api/comment/${comment._id}`, genConfig())
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


	return (
		<Card variant="outlined">
			{ deleted ? (
				<Alert 
					severity={'error'}
					message={'Deleted'}
				/>
			) : deleteRequestPending ? (
				<Alert 
					severity={'error'}
					message={'Deleting'}
				/>
			) : (<>
				<CardHeader
					avatar={
						<IconButton
							size="small"
							onClick={() => history.push(`/u/${comment.author}`)}
						>
							<Avatar
								style={{width: '40xp', height: '40px'}}>
									{ comment.author[0].toUpperCase() }
							</Avatar>
						</IconButton>
					}
					title={
						<HeaderText	>
							<PlainLink to={`/u/${comment.author}`}>
								<Typography>
									{ comment.author }
								</Typography>
							</PlainLink>
						</HeaderText>
					}
					subheader={
						<Typography variant="body2">
							Posted At {getHumanReadableDate(comment.createdAt)}
						</Typography>
					}
				/>
				<CommentContent>
					<CommentBody>
						{ comment.body }
					</CommentBody>
				</CommentContent>
				<CommentActions>
					<IconButton size="small" onClick={upvoteButtonHandler}>
						<UpvoteIcon $upvoted={isUpvoted()} />
					</IconButton>
					<Typography>
						{ comment.score }
					</Typography>
					<IconButton size="small" onClick={downvoteButtonHandler}>
						<DownvoteIcon $downvoted={isDownvoted()} />
					</IconButton>
					{loginState.loggedIn && 
					loginState.info.username === comment.author &&
					(
						<IconButton size="small" onClick={deleteButtonHandler}>
							<TrashIcon />
						</IconButton>
					)}
					
				</CommentActions>
			</>)}
		</Card>
	)
}
