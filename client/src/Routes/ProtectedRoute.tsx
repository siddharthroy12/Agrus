import { Route, RouteProps } from 'react-router-dom'

type CustomRoutePropsType = {
	component: any // Couldn't find the type
} & RouteProps


export default function ProtectedRoute({component: Component, ...rest}: CustomRoutePropsType) {
	return (
		<Route {...rest} render={props => {
			return (
				<>
					<Component {...props} />
				</>
			)}}
		/>
	)
}
