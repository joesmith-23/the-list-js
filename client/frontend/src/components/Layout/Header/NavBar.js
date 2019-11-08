import React from "react";
import { Link, withRouter } from "react-router-dom";

import "../../../App.css";

const NavBar = props => {
  const token = localStorage.getItem("token");

  const logout = e => {
    localStorage.removeItem("token");
    props.history.push("/");
  };

  const authLinks = (
    <ul>
      <li>
        <Link to="/dashboard">Dashboard</Link>
      </li>
      <li onClick={e => logout()}>Log Out</li>
    </ul>
  );

  const guestLinks = (
    <ul>
      <li>
        <Link to="/register">Register</Link>
      </li>
      <li>
        <Link to="/login">Login</Link>
      </li>
    </ul>
  );

  return (
    <header className="navbar">
      <nav className="navbar__navigation">
        <div className="navbar__logo">
          <Link to="/">The List</Link>
        </div>
        <div className="navbar__spacer"></div>
        <div className="navbar__navigation-items">
          {token ? authLinks : guestLinks}
        </div>
      </nav>
    </header>
  );
};

export default withRouter(NavBar);
