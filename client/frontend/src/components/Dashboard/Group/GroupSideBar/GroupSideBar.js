import React from "react";
import AddMember from "./AddMember";

import "./GroupSideBar.css";
import { FaEllipsisH } from "react-icons/fa";

const GroupSideBar = ({ group, addMember, members, deleteMember, owner }) => {
  let ownerName = null;
  if (owner) {
    ownerName = owner.firstName;
  }

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
      <small>Owner: {ownerName}</small>
      {/* <small>{group}</small> */}
      <h3 className="group-side-bar__title">Members</h3>
      {/* <h3>{group._id}</h3> */}
      <ul>{renderMembers}</ul>
      <AddMember />
    </div>
  );
};

export default GroupSideBar;
