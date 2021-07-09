import {
	Paper, IconButton, Avatar,
	InputBase
} from '@material-ui/core'

import {
	Image as ImageIcon,
	Link as LinkIcon
} from '@material-ui/icons'

import styled from 'styled-components'

const Wrapper = styled(Paper)`
	display: flex;
	width: 100%;
	padding: 0.5rem;
`

const AvatarBox = styled.div`
	margin-right: 0.5rem;
`

const InputBox = styled.div`
	padding: 0.5rem;
	background-color: rgba(0, 0, 0, 0.07);
	border-radius: 3px;
	width: 100%;
	display: flex;

	align-items: center;

	& > * {
		width: 100%;
	}
`

const PostTypeButtons = styled.div`
	margin-left: 0.5rem;
	display: flex;
`

export default function CreatePost() {
	return (
		<Wrapper elevation={3}>
			<AvatarBox>
				<IconButton size="small" aria-label="Go to Profile">
					<Avatar>H</Avatar>
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
