import { useState, useCallback } from 'react'
import axios from 'axios'
import { useParams } from 'react-router'
import {
	LinearProgress, Card, CardHeader, Avatar, Typography
} from '@material-ui/core'
import {
	Container, SubContainerMain, SubContainerAside
} from '../Components'
import { useDispatch } from 'react-redux'
import {
	useMounted, useOnMount
} from '../Hooks'
import reqErrorHandler from '../Utils/reqErrorHandler'
import getHumanReadableDate from '../Utils/getHumanReadableDate'

type UserType = {
	username: string,
	avatar: string,
	createdAt:string,
	isAdmin: boolean
}

export default function UserScreen() {
	const params:any = useParams()
	const isMounted = useMounted()
	const [user, setUser] = useState<UserType | null>(null)
	const [userLoading, setUserLoading] = useState(false)
	const dispatch = useDispatch()

	const getUser = useCallback(() => {
		if (!userLoading) {
			setUserLoading(true)
			axios.get(`/api/user/${params.username}`)
				.then(res => {
					if (isMounted()) {
						setUserLoading(false)
						setUser(res.data)
					}
				})
				.catch(error => {
					if (isMounted()) {
						setUserLoading(false)
						reqErrorHandler(error, 'Failed to get user due to slow network', dispatch)
					}
				})
		}
	},[
		params.username, dispatch,
		userLoading, isMounted
	])

	useOnMount(getUser)

	return (
		<Container>
			{userLoading && <LinearProgress />}
			{!userLoading && user && (<>
				<SubContainerMain>
					<Card variant="outlined" style={{width: '100%'}}>
						<CardHeader
							avatar={
								<Avatar
									src={(user as UserType).avatar}
									style={{width: '40xp', height: '40px'}}>
									{(user as UserType).username[0].toUpperCase()}
								</Avatar>
							}
							title={
								<Typography variant="subtitle2">
									u/{ (user as UserType).username }
								</Typography>
							}
							subheader={
								<Typography variant="body2">
									Joined At {getHumanReadableDate((user as UserType).createdAt)}
								</Typography>
							}
						/>
					</Card>
				</SubContainerMain>
				<SubContainerAside>
				</SubContainerAside>
			</>)}
		</Container>
	)
}
