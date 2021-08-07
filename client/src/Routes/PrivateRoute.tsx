import { Route, RouteProps, Redirect } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { StateType } from '../Store'
import Header from '../Components/Header'
import { useLocation } from 'react-router'

type CustomRoutePropsType = {
	component: React.ComponentType
} & RouteProps

// If user is not logged in redirect to login page
export default function PrivateRoute({component: Component, ...rest}: CustomRoutePropsType) {
	
	const loginState:any = useSelector((state: StateType) => state.login)
	const location = useLocation()
	const redirect = encodeURIComponent(location.pathname + location.search)

	return (
		<Route {...rest} render={props => {
			return (
				<>
					{loginState.loggedIn ? (
						<>
							<Header />
							<Component {...props} />
						</>
					): (
						<Redirect to={`/login?redirect=${redirect}`} />
					)}
				</>
			)}}
		/>
	)
}
