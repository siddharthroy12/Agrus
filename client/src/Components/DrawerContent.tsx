import {
	ListItem, List, ListItemIcon,
	ListItemText, Divider, ListSubheader, Avatar
} from '@material-ui/core'

import {
	Home as HomeIcon,
	Create as CreateIcon,
	AccountBox as AccountBoxIcon
} from '@material-ui/icons'

import { Link } from 'react-router-dom'

import { useSelector } from 'react-redux'
import { StateType } from '../Store'

import styled from 'styled-components'

const Wrapper = styled.div`
	width: 17rem;
`

const Banner = styled.div`
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: ${(props) => props.theme.primary};
	height: 10rem;
	color: ${props => props.theme.secondary};

	font-size: 2rem;
`

export default function DrawerContent() {
	const joinedBoards:any[] = useSelector((state:StateType) => state.joinedBoards.data)
	const joinedBoardsLoading = useSelector((state:StateType) => state.joinedBoards.loading)

	return (
		<Wrapper>
			<Banner>
				Agrus
			</Banner>
			<List>
				<ListItem button component={Link} to='/'>
					<ListItemIcon>
						<HomeIcon />
					</ListItemIcon>
					<ListItemText>
						Home
					</ListItemText>
				</ListItem>
				<ListItem button component={Link} to='/submit'>
					<ListItemIcon>
						<CreateIcon />
					</ListItemIcon>
					<ListItemText>
						Create Post
					</ListItemText>
				</ListItem>
				<ListItem button component={Link} to='/createboard'>
					<ListItemIcon>
						<CreateIcon />
					</ListItemIcon>
					<ListItemText>
						Create Board
					</ListItemText>
				</ListItem>
				<ListItem button>
					<ListItemIcon>
						<AccountBoxIcon />
					</ListItemIcon>
					<ListItemText>
						Profile
					</ListItemText>
				</ListItem>
			</List>
			<Divider />
			<List
				subheader={
        	<ListSubheader component="div">
          	Joined Boards
        	</ListSubheader>
      	}>
					{joinedBoardsLoading ? (
						<ListItem>
							Loading
						</ListItem>
					) : joinedBoards.map(board => (
						<ListItem button component={Link} to={`/b/${board.boardName}`}>
							<ListItemIcon>
								<Avatar alt="Remy Sharp" src={board.logo} style={{width: '2rem', height: '2rem'}}>
									{board.boardName[0].toUpperCase()}	
								</Avatar>
							</ListItemIcon>
							<ListItemText>
								b/{board.boardName}
							</ListItemText>
						</ListItem>
					))}
			</List>
		</Wrapper>
	)
}
