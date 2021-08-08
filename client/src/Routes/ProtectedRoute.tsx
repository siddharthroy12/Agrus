import { Route, RouteProps, Redirect } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { StateType } from '../Store'
import { useLocation } from 'react-router'
import queryString from 'query-string'

type CustomRoutePropsType = {
	component: React.ComponentType
} & RouteProps

// If user is logged in then reqdirect to Home Page
export default function ProtectedRoute({component: Component, ...rest}: CustomRoutePropsType) {
	const location = useLocation()
	const loginState:any = useSelector((state: StateType) => state.login)
	const redirect = queryString.parse(location.search).redirect
		? queryString.parse(location.search).redirect : '/'

	return (
		<Route {...rest} render={props => {
			return (
				<>
					{loginState.loggedIn ? (
						<Redirect to={redirect as string} />
					): (
						<Component {...props} />
					)}
				</>
			)}}
		/>
	)
}
