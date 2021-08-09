import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { 
  BrowserRouter as Router, 
  Switch, 
} from 'react-router-dom'
import { AlertDisplay } from './Components'
import { StateType } from './Store'
import { fetchJoinedBoards } from './Actions/boardActions'
import { clearAlert } from './Actions/alertActions'
import {
  HomeScreen, LoginScreen, RegisterScreen, CreateBoardScreen,
  SubmitScreen, PostScreen, UserScreen, BoardScreen, SearchScreen
} from './Screens'
import {
  PublicRoute, ProtectedRoute, PrivateRoute
} from './Routes'
import { lightTheme } from './themes'
import { ThemeProvider } from 'styled-components'
import { authenticate } from './Actions/loginActions'
import GlobalStyle from './GlobalStyles'

function App() {
  const loginState:any = useSelector((state:StateType) => state.login)
  const alertState:any = useSelector((state:StateType) => state.alert)
  const dispatch = useDispatch()

  // Check if token is present try authenticate and login
  useEffect(() => {
    const userInfoFromStorage = localStorage.getItem('loginInfo') ?
      JSON.parse(String(localStorage.getItem('loginInfo'))) : null

    if (userInfoFromStorage) {
      dispatch(authenticate())
    }
  }, [dispatch])

  useEffect(() => {
    if (loginState.loggedIn) {
      dispatch(fetchJoinedBoards())
    }
  }, [loginState.loggedIn, dispatch])

  return (
    <Router>
      <ThemeProvider theme={lightTheme}>
        <GlobalStyle />
        <AlertDisplay
          alert={alertState}
          closeAlert={() => dispatch(clearAlert())}
        />
        <Switch>
          {/* TODO: */}
          {/* Update Post Screen */}
          {/* Update Board Screen */}
          {/* Update User Screen */}
          {/* Finishe user screen */}
          <PublicRoute exact path='/search' component={SearchScreen} />
          <PrivateRoute exact path='/createboard' component={CreateBoardScreen} />
          <PublicRoute exact path='/b/:boardname' component={BoardScreen} />
          <PublicRoute exact path='/u/:username' component={UserScreen} />
          <PublicRoute exact path='/post/:id' component={PostScreen} />
          <ProtectedRoute exact path='/register' component={RegisterScreen} />
          <ProtectedRoute exact path="/login" component={LoginScreen} />
          <PrivateRoute exact path='/submit' component={SubmitScreen} />
          <PublicRoute exact path="/" component={HomeScreen} />
        </Switch>
      </ThemeProvider>
    </Router>
  );
}

export default App;
