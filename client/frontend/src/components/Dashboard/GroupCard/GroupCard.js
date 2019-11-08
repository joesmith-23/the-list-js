import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
// import Group from "../Group/Group";

import "./GroupCard.css";

const GroupCard = props => {
  const [lists, setLists] = useState([]);

  const groupMembers = props.group.members.map(member => (
    <li key={member._id}>{member.firstName}</li>
  ));

  useEffect(() => {
    const fetchLists = async () => {
      const response = await axios.get(
        `/api/lists/${props.group._id}`,
        props.config
      );
      let listData = response.data.data.lists;
      // console.log(listData);
      setLists([...listData]);
    };
    fetchLists();
  }, []);

  let renderLists = null;
  if (lists) {
    renderLists = lists.map(list => <li key={list._id}>{list.name}</li>);
  }

  return (
    <div className="group__container">
      <div className="group__information--title">
        <h3>
          <Link to={`/dashboard/groups/${props.group._id}`}>
            {props.group.name}
          </Link>
        </h3>
        <div className="spacer"></div>
        <p className="group__information--owner">
          Owner: {props.group.owner.firstName}
        </p>
      </div>
      <div className="group__information--body">
        <div className="group__information--lists">
          <h4>Lists</h4>
          <ul>{renderLists}</ul>
        </div>
        <div className="group__information--members">
          <h4>Members</h4>
          <ul>{groupMembers} </ul>
        </div>
        <span onClick={() => props.deleteGroup(props.group._id)} role="button">
          <p className="group__information--delete">Delete Group</p>
        </span>
      </div>
    </div>
  );
};

export default GroupCard;
