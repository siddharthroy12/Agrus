import { Route, RouteProps } from 'react-router-dom'
import Header from '../Components/Header'

import styled  from 'styled-components'

const Background = styled.div`
  background-color: ${(props) => props.theme.secondary};
`

type CustomRoutePropsType = {
	component: React.ComponentType
} & RouteProps


export default function PublicRoute({component: Component, ...rest}: CustomRoutePropsType) {
	return (
		<Route {...rest} render={props => {
			return (
				<>
					<Header />
					<Background>
						<Component {...props} />
					</Background>
				</>
			)}}
		/>
	)
}