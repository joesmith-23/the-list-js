import React, { Fragment } from "react";
import AddMember from "./AddMember/AddMember";
import { connect } from "react-redux";

import "./GroupSideBar.css";
import { FaTimes } from "react-icons/fa";
import ReactTooltip from "react-tooltip";
import Backdrop from "../../../utils/UI/Backdrop/Backdrop";
import * as uiActionCreators from "../../../../store/actions/uiActionCreators";

const GroupSideBar = props => {
  let ownerName = null;
  if (props.currentGroup.owner) {
    ownerName = props.currentGroup.owner.firstName;
  }

  let renderMembers = null;
  if (props.currentGroup.members) {
    renderMembers = props.currentGroup.members.map(member => (
      <li key={member._id}>
        <span>{member.firstName}</span>
        <span className="spacer"></span>
        {props.currentGroup.owner._id === props.currentUser._id ? (
          <span
            className="member__options"
            onClick={() => props.deleteMember(member._id)}
          >
            {member.firstName !== ownerName ? (
              <FaTimes data-tip="Remove Member" />
            ) : null}
            <ReactTooltip
              place="bottom"
              effect="solid"
              className="member__tooltip"
            />
          </span>
        ) : null}
      </li>
    ));
  }

  const mobileSidebarToggle = () => {
    props.onMobileSidebarToggle();
  };

  let sidebarStyle = "group-side-bar__container";
  if (props.mobileSidebarOpen) {
    sidebarStyle = "group-side-bar__container-mobile open";
  }

  return (
    <Fragment>
      <div className={sidebarStyle}>
        <h2>{props.currentGroup.name}</h2>
        <small>Owner: {ownerName}</small>
        <h3 className="group-side-bar__title">Members</h3>
        <ul>{renderMembers}</ul>
        <AddMember />
      </div>
      {props.backdropActive && <Backdrop toggle={mobileSidebarToggle} />}
    </Fragment>
  );
};

const mapStateToProps = state => {
  return {
    currentGroup: state.dashboard.currentGroup,
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

export default connect(mapStateToProps, mapDispatchToProps)(GroupSideBar);
