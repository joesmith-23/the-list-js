import React, { useEffect } from "react";
import { withRouter } from "react-router-dom";
// import axios from "axios";
import { connect } from "react-redux";
import * as dashboardActionCreators from "../../store/actions/dashboardActionCreators";
import * as userActionCreators from "../../store/actions/userActionCreators";

import GroupCard from "./GroupCard/GroupCard";
import SideBarMenu from "./SideBarMenu";
import "./Dashboard.css";

const Dashboard = props => {
  const config = {
    headers: {
      Authorization: `Bearer ${props.token}`
    }
  };

  useEffect(() => {
    if (props.token) {
      props.onInitGroups();
      props.onInitUser();
    }
  }, []);

  // Set the title depending on if the user is logged in or not
  let pageTitle = props.token ? (
    <div>
      <h2>{`${
        props.currentUser ? props.currentUser.firstName + "'s" : ""
      } Groups`}</h2>
    </div>
  ) : (
    <h2>You need to be logged in to access the dashboard</h2>
  );

  // Create array to allow React to render the groups to the page
  let renderGroups = null;
  if (props.groups) {
    renderGroups = props.groups.map(group => (
      <GroupCard
        key={group._id}
        group={group}
        deleteGroup={props.deleteGroupHandler}
        config={config}
        currentUser={props.currentUser}
      />
    ));
  }

  let renderErrorMessage = "";
  if (props.errorMessage) {
    renderErrorMessage = <p>{props.errorMessage}</p>;
  }

  return (
    <div>
      <div className="groups-content__container">
        <SideBarMenu
          config={config}
          title={pageTitle}
          renderErrorMessage={renderErrorMessage}
        />
        <div className="groups__wrapper">
          <ul className="groups-list__wrapper">{renderGroups}</ul>
        </div>
        {/* <input
          onChange={
            props.onCurrentUser
            // console.log(groups, currentUser);
          }
          type="text"
          name="text"
        ></input> */}
      </div>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    groups: state.dashboard.groups,
    currentUser: state.user.user,
    token: state.auth.token
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onInitGroups: () => dispatch(dashboardActionCreators.initGroups()),
    onInitUser: () => dispatch(userActionCreators.initUser()),
    deleteGroupHandler: id => dispatch(dashboardActionCreators.deleteGroup(id))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Dashboard));
