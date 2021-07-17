import Container from '../Components/Container'
import SubContainerMain from '../Components/SubContainerMain'
import SubContainerAside from '../Components/SubContainerAside'
import CreatePost from '../Components/CreatePost'
import Post from '../Components/Post'

import { Paper, Typography, Button } from '@material-ui/core'
import { Home as HomeIcon } from '@material-ui/icons'

import styled from 'styled-components'

const PageDescriptionBox = styled(Paper)`
	padding: 1rem;
`
const PageDescriptionTop = styled.div`
	display: flex;
	align-items: center;

	& > * {
		margin-right: 1rem;
	}
`

const PageDescription = styled(Typography)`
	margin-top: 1rem;
`

export default function HomeScreen() {
	return (
		<div>
			<Container>
				<SubContainerMain>
					<CreatePost />
						<Post />
						<Post />
				</SubContainerMain>
				<SubContainerAside>
					<PageDescriptionBox elevation={3}>
						<PageDescriptionTop>
							<HomeIcon />
							<Typography>Home</Typography>
						</PageDescriptionTop>
						<PageDescription>
							Your personal Reddit frontpage. Come here to check in with your favorite communities.
						</PageDescription>
						<Button>s</Button>
					</PageDescriptionBox>
				</SubContainerAside>
			</Container>
		</div>
	)
}
