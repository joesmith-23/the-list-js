import React, { useEffect } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import * as dashboardActionCreators from "../../store/actions/dashboardActionCreators";
import * as userActionCreators from "../../store/actions/userActionCreators";

import GroupCard from "./GroupCard/GroupCard";
import SideBarMenu from "./SideBarMenu";
import "./Dashboard.css";

const Dashboard = props => {
  useEffect(() => {
    if (props.token) {
      props.onInitGroups();
      props.onInitUser();
    }
  }, []);

  const leaveGroupHandler = id => {
    props.onLeaveGroup(id);
    window.location.reload();
  };

  // Create array to allow React to render the groups to the page
  let renderGroups = null;
  if (props.groups) {
    renderGroups = props.groups.map(group => (
      <GroupCard
        key={group._id}
        group={group}
        deleteGroup={props.deleteGroupHandler}
        leaveGroup={leaveGroupHandler}
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
        <SideBarMenu renderErrorMessage={renderErrorMessage} />
        <div className="groups__wrapper">
          <ul className="groups-list__wrapper">{renderGroups}</ul>
        </div>
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
    deleteGroupHandler: id => dispatch(dashboardActionCreators.deleteGroup(id)),
    onLeaveGroup: id => dispatch(dashboardActionCreators.leaveGroup(id))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Dashboard));
