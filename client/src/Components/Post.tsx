import { useState } from 'react'
import axios from 'axios'
import styled from 'styled-components'
import { useSelector, useDispatch } from 'react-redux'

import {
	Card, CardHeader, CardMedia, CardContent,
	Avatar, IconButton, Typography, CardActions
} from '@material-ui/core'

import {
	ArrowUpward as ArrowUpwardIcon,
	ArrowDownward as ArrowDownwardIcon,
	Bookmark as BookmarkIcon,
	MoreVert as MoreVertIcon,
	Message as MessageIcon
} from '@material-ui/icons'

import useMounted from '../Hooks/useMounted'

import { StateType } from '../Store'

import { 
	upvote,
	downvote
} from '../Actions/postActions'

const HeaderText = styled.div`
	display: flex;
	align-items: center;

	& > * {
		margin-right: 10px;
	}
`

const BoardName = styled(Typography)`
	font-weight: 500;
`

const PostContent = styled(CardContent)`
	padding-top: 0;
	padding-bottom: 1rem;
	font-weight: 300;
	padding-bottom: 0;
`

const MediaContainer = styled.div`
	display:flex;
	justify-content: center;
	background-color: black;
`

const PostTitle = styled(Typography)`
	font-weight: 500;
	margin-bottom: 0.5rem;
`

const PostBody = styled(Typography)`
	color: #505050;
	//background-color: rgba(0, 0, 0, 0.1);
	position: relative;

	max-height: 5rem;
	overflow: hidden;

	:after {
		position: absolute;
    content:"";
    height:100%;
    width:100%;
    top:0;
    left:0;
		background-image: linear-gradient( rgba(0,0,0,0), white );
		opacity: 0.6;
	}
`

const PostActions = styled(CardActions)`
	display: flex;

	& > * {
		margin-right: 1rem;
		margin-left: 0 !important;
	}
`

type UpvoteIconProps = {
	upvoted: boolean
}

const UpvoteIcon = styled(ArrowUpwardIcon)<UpvoteIconProps>`
	color: ${(props) => props.upvoted ? props.theme.primary : props.theme.fontColor };
`

type DownvoteIconProps = {
	downvoted: boolean
}

const DownvoteIcon = styled(ArrowDownwardIcon)<DownvoteIconProps>`
	color: ${(props) => props.downvoted ? props.theme.primary : props.theme.fontColor };
`

type PostType = {
	_id:string
	author: string,
	board: string,
	title: string,
	type: string,
	media: string,
	body: string,
	score: number,
	commentCount: number,
	edited: boolean,
	createdAt: string,
}

type propsType = {
	post: PostType
}

export default function Post({ post: _post }: propsType) {
	const [post, setPost] = useState(_post)
	const [voteRequestPending, setVoteRequestPending] = useState(false)
	const loginState:any = useSelector<StateType>(state => state.login)
	const mounted = useMounted()
	const dispatch = useDispatch()

	const getHumanReadableDate = (rawdate: string) => {
		const date = new Date(rawdate)
		return `Posted on ${date.getDate()}, ${date.getMonth()}, ${date.getFullYear()}`
	}

	const isUpvoted = () => {
		if (loginState.loggedIn) {
			const upvoted = loginState.info.upvotedPosts.filter((id:string) => id === post._id)
			return upvoted.length > 0 ? true : false
		} else {
			return false
		}
	}

	const isDownvoted = () => {
		if (loginState.loggedIn) {
			const downvoted = loginState.info.downvotedPosts.filter((id:string) => id === post._id)
			return downvoted.length > 0 ? true : false
		} else {
			return false
		}
	}

	const genConfig  = () => {
		const userInfoFromStorage = localStorage.getItem('loginInfo') ? JSON.parse(String(localStorage.getItem('loginInfo'))) : null

		return {
    	headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userInfoFromStorage.token}`
      }
  	}
	}

	const upvoteButtonHandler = () => {
		if (!voteRequestPending && loginState.loggedIn) {
			setVoteRequestPending(true)
			if (isUpvoted()) {
				setPost(prevPost => {
					return {...prevPost, score: prevPost.score - 1}
				})
			} else if (isDownvoted()) {
				setPost(prevPost => {
					return {...prevPost, score: prevPost.score + 2}
				})
			} else {
				setPost(prevPost => {
					return {...prevPost, score: prevPost.score + 1}
				})
			}

			dispatch(upvote(post._id))
			axios.post(`/api/post/${post._id}/upvote`, {}, genConfig())
				.then(res => {
					if (mounted) {
						setVoteRequestPending(false)
					}
				}).catch(function (error) {
					dispatch(upvote(post._id)) // Undo the upvote if fails
					
					if (isDownvoted()) {
						dispatch(downvote(post._id))
					}
					if (mounted) {
						if (isUpvoted()) {
							setPost(prevPost => {
								return {...prevPost, score: prevPost.score + 1}
							})
						} else if (isDownvoted()) {
							setPost(prevPost => {
								return {...prevPost, score: prevPost.score - 2}
							})
						} else {
							setPost(prevPost => {
								return {...prevPost, score: prevPost.score - 1}
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
					return {...prevPost, score: prevPost.score + 1}
				})
			} else if (isUpvoted()) {
				setPost(prevPost => {
					return {...prevPost, score: prevPost.score - 2}
				})
			} else {
				setPost(prevPost => {
					return {...prevPost, score: prevPost.score - 1}
				})
			}
			dispatch(downvote(post._id))
			axios.post(`/api/post/${post._id}/downvote`, {}, genConfig())
				.then(res => {
					if (mounted) {
						setVoteRequestPending(false)
					}
				}).catch(function (error) {
					dispatch(downvote(post._id)) // Undo the downvote if fails
					if (isUpvoted()) {
						dispatch(upvote(post._id))
					}
					if (mounted) {
						if (isUpvoted()) {
							setPost(prevPost => {
								return {...prevPost, score: prevPost.score - 1}
							})
						} else if (isUpvoted()) {
							setPost(prevPost => {
								return {...prevPost, score: prevPost.score + 2}
							})
						} else {
							setPost(prevPost => {
								return {...prevPost, score: prevPost.score + 1}
							})
						}
						setVoteRequestPending(false)
					}
				}
			)
		}
	}

	return (
		<Card elevation={3}>
			<CardHeader
				avatar={
					<IconButton size="small">
						<Avatar style={{width: '40xp', height: '40px'}}>{ post.author[0].toUpperCase() }</Avatar>
					</IconButton>
				}
				action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={
					<HeaderText	>
						{ post.board !== '' ? (
							<>
								<BoardName>
									{ post.board }
								</BoardName>
								<Typography>
									•
								</Typography>
							</>
						): null}
						<Typography>
							{ post.author }
						</Typography>
					</HeaderText>
				}
        subheader={getHumanReadableDate(post.createdAt)}
			/>
			<PostContent>
					<PostTitle>
						{ post.title }
					</PostTitle>
					{ post.type === 'text' && (
						<PostBody>
							{ post.body }
						</PostBody>
					)}
			</PostContent>
			{ post.type === 'image' && (
				<MediaContainer>
					<CardMedia
						component="img"
						alt="bruh"
						style={{height: '25rem', width: 'auto'}}
						image={post.media}
						title="image"
					/>
				</MediaContainer>
			)}
			{ post.type === 'video' && (
				<MediaContainer>
					<CardMedia
						component="video"
						style={{ width: '100%'}}
						controls
						src={post.media}
						title="video"
					/>
				</MediaContainer>
			)}
			
			<PostActions>
				<IconButton size="small" onClick={upvoteButtonHandler}>
					<UpvoteIcon upvoted={isUpvoted()} />
				</IconButton>
				<Typography>
					{ post.score }
				</Typography>
				<IconButton size="small" onClick={downvoteButtonHandler}>
					<DownvoteIcon downvoted={isDownvoted()} />
				</IconButton>
				<IconButton size="small">
					<MessageIcon />
				</IconButton>
				<Typography>
					{ post.commentCount }
				</Typography>
				<IconButton size="small">
					<BookmarkIcon />
				</IconButton>
			</PostActions>
		</Card>
	)
}
