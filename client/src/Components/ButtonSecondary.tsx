import styled from 'styled-components'
import { Button } from '@material-ui/core'

const ButtonSecondary = styled(Button)`
	background-color: unset;
	color: ${props => props.theme.primary};
	border-color: ${props => props.theme.primary};
`

export default ButtonSecondary