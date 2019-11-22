import React from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";

import * as authActionCreators from "../../../store/actions/authActionCreators";
import * as userActionCreators from "../../../store/actions/userActionCreators";

import "../../../App.css";

const NavBar = props => {
  const token = localStorage.getItem("token");

  if (token) {
    props.onLoadLocalAuth(token);
  }

  if (!props.currentUser) props.onLoadLocalUser();

  const logoutHandler = e => {
    localStorage.removeItem("token");
    props.onLogout();
    props.onLogoutRemoveUser();
    props.history.push("/");
  };

  const authLinks = (
    <ul>
      <li>
        <Link to="/dashboard">{`${
          props.currentUser ? props.currentUser.firstName + "'s" : ""
        } Dashboard`}</Link>
      </li>
      <li className="logout" role="button" onClick={e => logoutHandler()}>
        Log Out
      </li>
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

const mapStateToProps = state => {
  return {
    currentUser: state.user.user
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onLoadLocalAuth: token => dispatch(authActionCreators.loadLocalAuth(token)),
    onLogout: () => dispatch(authActionCreators.logout()),
    onLogoutRemoveUser: () => dispatch(userActionCreators.removeCurrentUser()),
    onLoadLocalUser: () => dispatch(userActionCreators.initUserFromLocal())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(NavBar));
