import { Route, RouteProps } from 'react-router-dom'
import Header from '../Components/Header'
import { useLocation } from 'react-router'

type CustomRoutePropsType = {
	component: React.ComponentType
} & RouteProps


export default function PublicRoute({component: Component, ...rest}: CustomRoutePropsType) {
	const location = useLocation()
	return (
		<Route {...rest} key={location.pathname} render={props => {
			return (
				<>
					<Header />
					<Component {...props} />
				</>
			)}}
		/>
	)
}