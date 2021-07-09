import { 
  BrowserRouter as Router, 
  Switch, 
  Route
} from 'react-router-dom'

import HomeScreen from './Screens/HomeScreen'
import Header from './Components/Header'

import { lightTheme } from './themes'
import styled, { ThemeProvider } from 'styled-components'


const Background = styled.div`
  background-color: ${(props) => props.theme.secondary};
`

function App() {
  return (
    <Router>
      <ThemeProvider theme={lightTheme}>
        <Header />
        <Background>
          <Switch>
            <Route exact path="/">
              <HomeScreen />
            </Route>
          </Switch>
        </Background>
      </ThemeProvider>
    </Router>
  );
}

export default App;
