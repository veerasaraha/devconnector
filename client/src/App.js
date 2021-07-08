import React, { Fragment } from 'react'
import './App.css'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Navbar from './components/Navbar'
import Landing from './components/Landing'
import Register from './components/auth/Register'
import Login from './components/auth/Login'

const App = () => {
  return (
    <Router>
      <Fragment>
        <Navbar />
        <Route exact path='/' component={Landing} />
        <section className='container'>
          <Switch>
            <Route exact path='/register' component={Register} />
            <Route exact path='/login' component={Login} />
            <Route exact path='' component={''} />
            <Route exact path='' component={''} />
          </Switch>
        </section>
      </Fragment>
    </Router>
  )
}

export default App
