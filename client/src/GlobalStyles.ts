// @ts-nocheck
import { createGlobalStyle } from 'styled-components';
 
const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${(props) => props.theme.background}
  }
`

export default GlobalStyle