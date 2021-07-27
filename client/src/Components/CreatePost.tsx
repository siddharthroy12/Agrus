import {
	Paper, IconButton, Avatar,
	InputBase
} from '@material-ui/core'

import {
	Image as ImageIcon,
	Link as LinkIcon
} from '@material-ui/icons'

import styled from 'styled-components'

import { useSelector } from 'react-redux'

import { useHistory } from 'react-router'

const Wrapper = styled(Paper)`
	display: flex;
	width: 100%;
	padding: 0.5rem;
`

const AvatarBox = styled.div`
	margin-right: 0.5rem;
	display: flex;
`

const InputBox = styled.div`
	padding: 0.5rem;
	background-color: rgba(0, 0, 0, 0.02);
	border-radius: 3px;
	width: 100%;
	display: flex;

	align-items: center;

	& > * {
		width: 100%;
	}

	box-shadow: 0px 0px 2px 1px #c1c1c1 inset;
`

const PostTypeButtons = styled.div`
	margin-left: 0.5rem;
	display: flex;
`

export default function CreatePost() {
	// Type doesn't matter here and I'm lazu
	const loginState = useSelector((state:any) => state.login)
	const history = useHistory()

	return (
		<Wrapper elevation={1} onClick={() => history.push('/submit')}>
			<AvatarBox>
				<IconButton size="small" aria-label="Go to Profile">
					<Avatar alt="Remy Sharp" src={loginState.info.avatar} style={{width: '2rem', height: '2rem'}}>
						{loginState.info.username[0].toUpperCase()}	
						</Avatar>
				</IconButton>
			</AvatarBox>
			<InputBox>
				<InputBase
					placeholder="Create Post"
				/>
			</InputBox>
			<PostTypeButtons>
				<IconButton>
					<ImageIcon />
				</IconButton>
				<IconButton>
					<LinkIcon />
				</IconButton>
			</PostTypeButtons>
		</Wrapper>
	)
}
