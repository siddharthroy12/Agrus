import { useState, SyntheticEvent } from 'react'

import { 
	AppBar, Toolbar, IconButton,
	Typography, Button, InputBase,
	List, ListItem, Popover,
	Divider, Avatar
} from "@material-ui/core"

import {
	Menu as MenuIcon,
	Search as SearchIcon,
	Settings as SettingsIcon,
	AccountCircle as AccountCircleIcon
} from '@material-ui/icons'

import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { StateType } from '../Store'
import { logout } from '../Actions/loginActions'

import styled from 'styled-components'

const SearchBox = styled.div`
	display: flex;
	background-color: rgba(255, 255, 255, 0.15);
	align-items: center;
	border-radius: 3px;
	padding: 0.2rem 1rem;
	width: 100%;
	max-width: 40rem;
	margin-left: 1rem;

	&:hover {
		background-color: rgba(225, 255, 255, 0.25);
	}

	@media screen and (max-width: 450px) {
		display: none;
	}
`

const SearchBoxIcon = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	padding-right: 0.5rem;
`

const SearchBoxInput = styled(InputBase)`
	color: white;
	width: 100%;
`

const CenterHorizontal = styled.div`
	display: flex;
	justify-content: center;
	width: 100%;
`

const LeftOptions = styled.div`
	margin-left: auto;
	color: white;
	display: flex;
	align-items: center;

	> * {
		margin-left: 1rem !important;
	}
`

const SearchIconButton = styled(IconButton)`
	color: white;
	padding: 0.5rem;

	@media screen and (min-width: 451px) {
		display: none !important;
	}
`

const SignUpButton = styled(Button)`
	color: white;
	border-color: white;
	width: max-content;
`

const UserMenu = styled.div`
	width: 15rem;

	.subMenu {
		
	}

	.subMenuHeader {
		display: flex;
		align-items: center;
		padding: 1rem;
		padding-bottom: 0.5rem;
	}

	.subMenuHeaderIcon {
		display: flex;
		align-items: center;
		width: 2.5rem;
	}

	.subMenuList {
		padding: 0;
	}

	.subMenuListItem {
		padding: 1rem 1rem;
		padding-left: 3.5rem;
	}

	.subMenuListItem:hover {
		background-color: rgba(0, 0, 0, 0.05);
	}
`

export default function Header() {
	const [userMenuIsOpen, setUserMenuIsOpen] = useState<Element | boolean>(false)

	const loginState:any = useSelector((state:StateType) => state.login)
	const dispatch = useDispatch()

	const handleUserMenuBtnClick = (e: SyntheticEvent) => {
		setUserMenuIsOpen(e.currentTarget)
	}

	const handleCloseMenu = () => {
		setUserMenuIsOpen(false)
	}

	const handleLogoutButton = () => {
		dispatch(logout())
	}

	return (
		<AppBar position="sticky">
		<Toolbar>
			<IconButton edge="start" color="inherit" aria-label="menu">
				<MenuIcon />
			</IconButton>
			<Typography variant="h6">
				Agrus
			</Typography>
			<CenterHorizontal>
				<SearchBox>
					<SearchBoxIcon>
						<SearchIcon />
					</SearchBoxIcon>
					<SearchBoxInput
						placeholder="Search…"
						inputProps={{ 'aria-label': 'search' }}
					/>
				</SearchBox>
			</CenterHorizontal>
			<LeftOptions>
				<SearchIconButton style={{color: 'white'}}>
					<SearchIcon />
				</SearchIconButton>
				{ loginState.loggedIn ? (
					<>
					<IconButton onClick={handleUserMenuBtnClick}>
						<Avatar alt="Remy Sharp" src={loginState.info.avatar} style={{width: '2rem', height: '2rem'}}>
							{loginState.info.username[0].toUpperCase()}	
						</Avatar>
					</IconButton>
				
						<Popover
							id="simple-menu"
							anchorEl={userMenuIsOpen as Element}
							keepMounted
							open={Boolean(userMenuIsOpen)}
							onClose={handleCloseMenu} 
							anchorOrigin={{
								vertical: 'bottom',
								horizontal: 'right',
							}}
							transformOrigin={{
								vertical: 'top',
								horizontal: 'right',
							}}
      			>
							<UserMenu>
								<div className="subMenu">
									<div className="subMenuHeader">
										<div className="subMenuHeaderIcon">
											<AccountCircleIcon />
										</div>
										<div className="subMenuHeaderText">
											My Stuffs
										</div>
									</div>
									<List className="subMenuList">
										<ListItem className="subMenuListItem">
											Profile
										</ListItem>
										<ListItem className="subMenuListItem" button onClick={handleLogoutButton}>
											Logout
										</ListItem>
									</List>
								</div>
								<Divider />
								<div className="subMenu">
									<div className="subMenuHeader">
										<div className="subMenuHeaderIcon">
											<SettingsIcon />
										</div>
										<div className="subMenuHeaderText">
											Settings
										</div>
									</div>
									<List className="subMenuList">
										<ListItem className="subMenuListItem">
											Switch Theme
										</ListItem>
									</List>
								</div>
							</UserMenu>
						</Popover>
					</>
				) : (
					<>
						<Button variant="contained" disableElevation component={Link} to='/login'>Login</Button>
						{ /* @ts-ignore */ }
						<SignUpButton variant="outlined" component={Link} to='/register'>Sign Up</SignUpButton>
					</>
				)}
			</LeftOptions>
		</Toolbar>
		</AppBar>
	)
}
