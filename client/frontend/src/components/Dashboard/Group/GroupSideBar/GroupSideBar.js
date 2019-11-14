import React from "react";

import AddMember from "./AddMember";
import "./GroupSideBar.css";

import { FaEllipsisH } from "react-icons/fa";

const GroupSideBar = ({ group, token, addMember, members, deleteMember }) => {
  let renderMembers = null;
  if (members) {
    renderMembers = members.map(member => (
      <li key={member._id}>
        <span>{member.firstName}</span>
        <span className="spacer"></span>
        <span
          className="member__options"
          onClick={() => deleteMember(member._id)}
        >
          <FaEllipsisH />
        </span>
      </li>
    ));
  }

  return (
    <div className="group-side-bar__container">
      <h2>{group.name}</h2>
      <h3 className="group-side-bar__title">Members</h3>
      {/* <h3>{group._id}</h3> */}
      <ul>{renderMembers}</ul>
      <AddMember token={token} group={group} addMember={addMember} />
    </div>
  );
};

export default GroupSideBar;
