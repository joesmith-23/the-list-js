import React, { Fragment } from 'react';
import { BrowserRouter as Router, Route  } from 'react-router-dom';
import NavBar from './components/layout/NavBar';
import Landing from './components/layout/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import './App.css';

const App = () => 
    <Router>
      <Fragment>
        <NavBar />
        <Route exact path='/' component={Landing} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
      </Fragment>
    </Router>
    

export default App;
