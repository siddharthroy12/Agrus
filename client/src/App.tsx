import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { 
  BrowserRouter as Router, 
  Switch, 
} from 'react-router-dom'

import HomeScreen from './Screens/HomeScreen'
import LoginScreen from './Screens/LoginScreen'
import RegisterScreen from './Screens/RegisterScreen'

import PublicRoute from './Routes/PublicRoute'
import ProtectedRoute from './Routes/ProtectedRoute'

import { lightTheme } from './themes'
import { ThemeProvider } from 'styled-components'

import { authenticate } from './Actions/loginActions'

function App() {

  //const loginState = useSelector<StateType>(state => state.login)
  const dispatch = useDispatch()

  // Check if token is present try authenticate and login
  useEffect(() => {
    const userInfoFromStorage = localStorage.getItem('loginInfo') ? JSON.parse(String(localStorage.getItem('loginInfo'))) : null

    if (userInfoFromStorage) {
      dispatch(authenticate())
    }
  }, [dispatch])

  return (
    <Router>
      <ThemeProvider theme={lightTheme}>
        <Switch>
          <ProtectedRoute exact path='/register' component={RegisterScreen} />
          <ProtectedRoute exact path="/login" component={LoginScreen} />
          <PublicRoute exact path="/" component={HomeScreen} />
        </Switch>
      </ThemeProvider>
    </Router>
  );
}

export default App;
