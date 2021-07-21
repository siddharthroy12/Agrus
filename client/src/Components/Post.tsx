import styled from 'styled-components'

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

	height: 5rem;
	overflow: hidden;

	:after {
		position: absolute;
    content:"";
    height:100%;
    width:100%;
    top:0;
    left:0;
		background-image: linear-gradient( white,#060606 );
		opacity: 0.3;
	}
`

const PostActions = styled(CardActions)`
	display: flex;

	& > * {
		margin-right: 1rem;
		margin-left: 0 !important;
	}
`

type PostType = {
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

export default function Post({ post }: propsType) {

	const getHumanReadableDate = (rawdate: string) => {
		const date = new Date(rawdate)
		return `Posted on ${date.getDate()}, ${date.getMonth()}, ${date.getFullYear()}`
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
						alt="Contemplative Reptile"
						style={{height: '25rem', width: 'auto'}}
						image={post.media}
						title="Paella dish"
					/>
				</MediaContainer>
			)}
			
			<PostActions>
				<IconButton size="small">
					<ArrowUpwardIcon />
				</IconButton>
				<Typography>
					{ post.score }
				</Typography>
				<IconButton size="small">
					<ArrowDownwardIcon />
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
