import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

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

  // Check if token is present try authenticate and login
  useEffect(() => {

  }, [])

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
