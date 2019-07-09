import React, { Fragment } from 'react';
import { Link, withRouter } from 'react-router-dom';

const NavBar = (props) => {

    const token = localStorage.getItem('token');

    const logout = e => {
        localStorage.removeItem('token');
        props.history.push('/');
    }

    const authLinks = (
        <ul>
            <li onClick={e => logout()}>Log Out</li>
        </ul>
    );

    const guestLinks =  (
        <ul>
            <li><Link to="/register">Register</Link></li>
            <li><Link to="/login">Login</Link></li>
        </ul>
    );

    return (
        <nav className="navbar">
            <h1>
                <Link to="/">The List</Link>
            </h1>
            <Fragment>{ token ? authLinks : guestLinks }</Fragment>
        </nav>

    )
}

export default withRouter(NavBar)
