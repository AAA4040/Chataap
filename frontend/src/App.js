import React from 'react'

import {BrowserRouter as Router, Route, Switch} from "react-router-dom"
import PrivateRoute from "./utils/PrivateRoute"
import { AuthProvider } from './context/AuthContext'

import Registerpage from './views/Registerpage'
import Loginpage from './views/Loginpage'
import Navbar from './views/Navbar'
import Message from './views/Message'
import MessageDetail from './views/MessageDetail'
import SearchUsers from './views/SearchUsers'



function App() {
  return (
    <Router>
      <AuthProvider>
        < Navbar/>
        <Switch>
          <Route component={Loginpage} path="/login" />
          <Route component={Registerpage} path="/register" exact />
          <PrivateRoute  component={Message} path="/" exact />
          <PrivateRoute  component={MessageDetail} path="/:id" exact />
          <PrivateRoute  component={SearchUsers} path="/search/:username" exact />
        </Switch>
      </AuthProvider>
    </Router>
  )
}

export default App