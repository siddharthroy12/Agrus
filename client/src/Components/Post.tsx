import { useState, SyntheticEvent } from 'react'
import axios from 'axios'
import styled from 'styled-components'
import { useSelector, useDispatch } from 'react-redux'

import {
	Card, CardHeader, CardMedia, CardContent, List, ListItem,
	Avatar, IconButton, Typography, CardActions, Popover
} from '@material-ui/core'

import { Link } from 'react-router-dom'

import {
	ArrowUpward as ArrowUpwardIcon,
	ArrowDownward as ArrowDownwardIcon,
	Bookmark as BookmarkIcon,
	MoreVert as MoreVertIcon,
	Message as MessageIcon,
} from '@material-ui/icons'

import useMounted from '../Hooks/useMounted'

import { StateType } from '../Store'

import Alert from '../Components/Alert'

import { 
	upvotePost,
	downvotePost,
	savePost
} from '../Actions/postActions'

import genConfig from '../Utils/genConfig'

export const HeaderText = styled.div`
	display: flex;
	align-items: center;

	& > * {
		margin-right: 10px;
	}
`

export const BoardName = styled(Typography)`
	font-weight: 500;
`

export const PostContent = styled(CardContent)`
	padding-top: 0;
	padding-bottom: 1rem;
	font-weight: 300;
	padding-bottom: 0;
`

export const MediaContainer = styled.div`
	display:flex;
	justify-content: center;
	background-color: black;
`

export const PostTitle = styled(Typography)`
	font-weight: 500;
	margin-bottom: 0.5rem;
`

export const PostBody = styled(Typography)`
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

export const PostActions = styled(CardActions)`
	display: flex;

	& > * {
		margin-right: 1rem;
		margin-left: 0 !important;
	}
`

export const Menu = styled.div`
	.menu-item {
		padding: 1rem;
	}
`

export type UpvoteIconProps = {
	upvoted: boolean
}

export const UpvoteIcon = styled(ArrowUpwardIcon)<UpvoteIconProps>`
	color: ${(props) => props.upvoted ? props.theme.primary : props.theme.fontColor };
`

export type DownvoteIconProps = {
	downvoted: boolean
}

export const DownvoteIcon = styled(ArrowDownwardIcon)<DownvoteIconProps>`
	color: ${(props) => props.downvoted ? props.theme.primary : props.theme.fontColor };
`

export type SaveIconProps = {
	saved: boolean
}

export const SaveIcon = styled(BookmarkIcon)<SaveIconProps>`
	color: ${(props) => props.saved ? props.theme.primary : props.theme.fontColor };
`

export const CommentIcon = styled(MessageIcon)`
	color: ${(props) => props.theme.fontColor };
`

const PlainLink = styled(Link)`
	text-decoration: none;
	color: unset;
`

export const getHumanReadableDate = (rawdate: string) => {
	const date = new Date(rawdate)
	return `Posted on ${date.getDate()}, ${date.getMonth()}, ${date.getFullYear()}`
}

export type PostType = {
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
	const [saveRequestPending, setSaveRequestPending] = useState(false)
	const [voteRequestPending, setVoteRequestPending] = useState(false)
	const [deletePending, setDeletePending] = useState(false)
	const [deleted, setDeleted] = useState(false)
	const loginState:any = useSelector<StateType>(state => state.login)
	const [menuIsOpen, setMenuIsOpen] = useState<Element | boolean>(false)
	const isMounted = useMounted()
	const dispatch = useDispatch()

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

	const isSaved = () => {
		if (loginState.loggedIn) {
			const saved = loginState.info.savedPosts.filter((id:string) => id === post._id)
			return saved.length > 0 ? true : false
		} else {
			return false
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

			dispatch(upvotePost(post._id))
			axios.post(`/api/post/${post._id}/upvote`, {}, genConfig())
				.then(res => {
					if (isMounted()) {
						setVoteRequestPending(false)
					}
				}).catch(function (error) {
					dispatch(upvotePost(post._id)) // Undo the upvote if fails
					
					if (isDownvoted()) {
						dispatch(downvotePost(post._id))
					}
					if (isMounted()) {
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
			dispatch(downvotePost(post._id))
			axios.post(`/api/post/${post._id}/downvote`, {}, genConfig())
				.then(res => {
					if (isMounted()) {
						setVoteRequestPending(false)
					}
				}).catch(function (error) {
					dispatch(downvotePost(post._id)) // Undo the downvote if fails
					if (isUpvoted()) {
						dispatch(upvotePost(post._id))
					}
					if (isMounted()) {
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

	const saveButtonHandler = () => {
		if (!saveRequestPending && loginState.loggedIn) {
			setSaveRequestPending(true)

			dispatch(savePost(post._id))
			axios.post(`/api/post/${post._id}/save`, {}, genConfig())
				.then(res => {
					if (isMounted()) {
						setSaveRequestPending(false)
					}
				}).catch(function (error) {
					dispatch(savePost(post._id)) // Undo the save if fails
					if (isMounted()) {
						setSaveRequestPending(false)
					}
				}
			)
		}
	}

	const deleteButtonHandler = () => {
		if (!deletePending) {
			setDeletePending(true)

			axios.delete(`/api/post/${post._id}`, genConfig())
				.then(res => {
					if (isMounted()) {
						setDeleted(true)
						setDeletePending(false)
					}
				})
				.catch(error => {
					if (isMounted()) {
						setDeletePending(false)
					}
				})
		}
	}

	const menuButtonHandler = (e: SyntheticEvent) => {
		setMenuIsOpen(e.currentTarget)
	}

	const closeMenu = () => {
		setMenuIsOpen(false)
	}

	return (
		<Card elevation={1}>
			{ deleted ? (
				<Alert 
					severity={'error'}
					message={'Deleted'}
				/>
			) : (
				deletePending ? (
					<Alert 
						severity={'error'}
						message={'Deleting'}
					/>
				) : (<>
					<CardHeader
						avatar={
							<IconButton size="small">
								<Avatar
									style={{width: '40xp', height: '40px'}}>
										{ post.author[0].toUpperCase() }
								</Avatar>
							</IconButton>
						}
						action={<>
							<IconButton
								aria-label="settings"
								onClick={menuButtonHandler}>
								<MoreVertIcon />
							</IconButton>
							<Popover
								id="simple-menu"
								anchorEl={menuIsOpen as Element}
								keepMounted
								open={Boolean(menuIsOpen)}
								onClose={closeMenu} 
								anchorOrigin={{
									vertical: 'bottom',
									horizontal: 'right',
								}}
								transformOrigin={{
									vertical: 'top',
									horizontal: 'right',
								}}
							>
								<Menu>
									<List>
										<ListItem 
											className="menu-item"
											button
											component={Link}
											to={`/u/${post.author}`}>
												Visit User
										</ListItem>
										{ post.board !== '' ? (
											<ListItem
												className="menu-item" 
												button
												component={Link}
												to={`/b/${post.board}`}>
													Visit Board
											</ListItem>
										): null}
										{
											loginState.loggedIn ? loginState.info.username === post.author ? (
												<ListItem
													className="menu-item"
													button
													onClick={deleteButtonHandler}>
														Delete Post
												</ListItem>
											): null : null
										}
									</List>
								</Menu>
							</Popover>
						</>}
        		title={
							<HeaderText	>
								{ post.board !== '' ? (
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
								): null}
								<PlainLink to={`/u/${post.author}`}>
									<Typography>
										{ post.author }
									</Typography>
								</PlainLink>
							</HeaderText>
						}
        		subheader={getHumanReadableDate(post.createdAt)}
					/>
					<PlainLink to={`/post/${post._id}`}>
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
					</PlainLink>
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
							<CommentIcon />
						</IconButton>
						<Typography>
							{ post.commentCount }
						</Typography>
						<IconButton size="small" onClick={saveButtonHandler}>
							<SaveIcon saved={isSaved()} />
						</IconButton>
					</PostActions>
				</>)
			)}
		</Card>
	)
}
