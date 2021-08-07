import { Route, RouteProps } from 'react-router-dom'
import Header from '../Components/Header'

type CustomRoutePropsType = {
	component: React.ComponentType
} & RouteProps


export default function PublicRoute({component: Component, ...rest}: CustomRoutePropsType) {
	return (
		<Route {...rest} render={props => {
			return (
				<>
					<Header />
					<Component {...props} />
				</>
			)}}
		/>
	)
}