import React from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import { FaCog, FaLayerGroup } from "react-icons/fa";

import "./SideBarMenu.css";
import AddGroup from "./AddGroup/AddGroup";

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

  return (
    <div className="sidebar__container">
      {props.title}
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
  );
};

const mapStateToProps = state => {
  return {
    groups: state.dashboard.groups
  };
};

export default connect(mapStateToProps)(withRouter(SideBarMenu));
