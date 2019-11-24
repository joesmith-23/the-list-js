import React from "react";
import AddMember from "./AddMember";
import { connect } from "react-redux";

import "./GroupSideBar.css";
import { FaTimes } from "react-icons/fa";
import ReactTooltip from "react-tooltip";

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
            <FaTimes data-tip="Remove Member" />
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

  return (
    <div className="group-side-bar__container">
      <h2>{props.currentGroup.name}</h2>
      <small>Owner: {ownerName}</small>
      {/* <small>{group}</small> */}
      <h3 className="group-side-bar__title">Members</h3>
      {/* <h3>{group._id}</h3> */}
      <ul>{renderMembers}</ul>
      <AddMember />
    </div>
  );
};

const mapStateToProps = state => {
  return {
    currentGroup: state.dashboard.currentGroup,
    currentUser: state.user.user
  };
};

export default connect(mapStateToProps)(GroupSideBar);
