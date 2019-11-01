import React from "react";

const GroupCard = props => {
  const groupMembers = props.group.members.map(member => (
    <span key={member._id}>{member.firstName}</span>
  ));

  return (
    <div>
      <h3>{props.group.name}</h3>
      <p>Owner: {props.group.owner.firstName}</p>
      <p>Members: {groupMembers} </p>
    </div>
  );
};

export default GroupCard;
