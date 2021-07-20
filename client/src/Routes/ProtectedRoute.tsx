import { Route, RouteProps, Redirect } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { StateType } from '../Store'

type CustomRoutePropsType = {
	component: React.ComponentType
} & RouteProps

// If user is logged in then reqdirect to Home Page
export default function ProtectedRoute({component: Component, ...rest}: CustomRoutePropsType) {
	
	const loginState:any = useSelector((state: StateType) => state.login)

	return (
		<Route {...rest} render={props => {
			return (
				<>
					{loginState.loggedIn ? (
						<Redirect to='/' />
					): (
						<Component {...props} />
					)}
				</>
			)}}
		/>
	)
}
