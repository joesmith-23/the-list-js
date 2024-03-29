import React from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";

import HamburgerToggleButton from "../HamburgerToggleButton/HamburgerToggleButton";
import * as authActionCreators from "../../../../store/actions/authActionCreators";
import * as userActionCreators from "../../../../store/actions/userActionCreators";
import * as dashboardActionCreators from "../../../../store/actions/dashboardActionCreators";
import * as uiActionCreators from "../../../../store/actions/uiActionCreators";

import "./NavBar.css";

const NavBar = props => {
  const token = localStorage.getItem("token");

  if (token) {
    props.onLoadLocalAuth(token);
  }

  if (!props.currentUser && token) props.onLoadLocalUser();

  const logoutHandler = e => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    props.onLogout();
    props.onLogoutRemoveUser();
    props.onLogoutRemoveDashboardData();
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

  const mobileSidebarToggle = () => {
    props.onMobileSidebarToggle();
  };

  return (
    <header className="navbar">
      <nav className="navbar__navigation">
        <HamburgerToggleButton toggle={mobileSidebarToggle} />
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
    onLogoutRemoveDashboardData: () =>
      dispatch(dashboardActionCreators.removeCurrentData()),
    onLoadLocalUser: () => dispatch(userActionCreators.initUserFromLocal()),
    onMobileSidebarToggle: () => {
      dispatch(uiActionCreators.mobileSidebarToggle());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(NavBar));
