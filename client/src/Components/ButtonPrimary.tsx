import styled from 'styled-components'
import { Button } from '@material-ui/core'

const ButtonPrimary = styled(Button)`
	background-color: ${props => props.theme.primary};
	color: white;
`

export default ButtonPrimary