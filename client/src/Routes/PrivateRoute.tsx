import { Route, RouteProps, Redirect } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { StateType } from '../Store'
import styled  from 'styled-components'
import Header from '../Components/Header'

const Background = styled.div`
  background-color: ${(props) => props.theme.secondary};
`

type CustomRoutePropsType = {
	component: React.ComponentType
} & RouteProps

// If user is not logged in redirect to login page
export default function PrivateRoute({component: Component, ...rest}: CustomRoutePropsType) {
	
	const loginState:any = useSelector((state: StateType) => state.login)

	return (
		<Route {...rest} render={props => {
			return (
				<>
					{loginState.loggedIn ? (
						<>
							<Header />
							<Background>
								<Component {...props} />
							</Background>
						</>
					): (
						<Redirect to='/login' />
					)}
				</>
			)}}
		/>
	)
}
