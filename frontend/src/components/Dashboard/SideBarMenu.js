import React, { Fragment } from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import { FaCog, FaLayerGroup } from "react-icons/fa";

import "./SideBarMenu.css";
import AddGroup from "./AddGroup/AddGroup";
import Backdrop from "../utils/UI/Backdrop/Backdrop";
import * as uiActionCreators from "../../store/actions/uiActionCreators";

const SideBarMenu = props => {
  let groupNames = null;
  if (props.groups) {
    groupNames = props.groups.map(group => (
      <div key={group._id}>
        <Link to={`/dashboard/groups/${group._id}`}>
          <li>
            <span className="icon__groups">
              <FaLayerGroup />
            </span>{" "}
            {group.name}
          </li>
        </Link>
      </div>
    ));
  }

  // Set the title depending on if the user is logged in or not
  let pageTitle = props.token ? (
    <div className="sidebar__title">
      <h2>{`${
        props.currentUser ? props.currentUser.firstName + "'s" : ""
      } Groups`}</h2>
    </div>
  ) : (
    <h2>You need to be logged in to access your dashboard</h2>
  );

  const mobileSidebarToggle = () => {
    props.onMobileSidebarToggle();
  };

  let sidebarStyle = "sidebar__container";
  if (props.mobileSidebarOpen) {
    sidebarStyle = "sidebar__container-mobile";
  }

  return (
    <Fragment>
      <div className={sidebarStyle}>
        {pageTitle}
        {props.renderErrorMessage}
        <ul className="group-names">{groupNames}</ul>
        <AddGroup config={props.config} />
        <p className="settings__text">
          <Link to="#">
            <span className="icon__settings">
              <FaCog />
            </span>
            <span> Settings</span>
          </Link>
        </p>
      </div>
      {props.backdropActive && <Backdrop toggle={mobileSidebarToggle} />}
    </Fragment>
  );
};

const mapStateToProps = state => {
  return {
    token: state.auth.token,
    groups: state.dashboard.groups,
    currentUser: state.user.user,
    mobileSidebarOpen: state.ui.mobileSidebarOpen,
    backdropActive: state.ui.backdropActive
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onMobileSidebarToggle: () => {
      dispatch(uiActionCreators.mobileSidebarToggle());
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(SideBarMenu));
