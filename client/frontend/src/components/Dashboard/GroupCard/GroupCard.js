import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
// import Group from "../Group/Group";

import "./GroupCard.css";
import { AiOutlineDelete } from "react-icons/ai";
import { IoMdArrowRoundForward } from "react-icons/io";
import { FiUsers, FiList } from "react-icons/fi";

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
        <div className="group__information--main-content">
          <div className="group__information--content">
            <span className="content-title__wrapper">
              <span className="content-title__icons">
                <FiList />
              </span>
              <h4>Lists</h4>
            </span>
            <ul>{renderLists}</ul>
          </div>
          <div className="group__information--content">
            <span className="content-title__wrapper">
              <span className="content-title__icons">
                <FiUsers />
              </span>
              <h4>Members</h4>
            </span>
            <ul>{groupMembers} </ul>
          </div>
        </div>
        <div className="button__wrapper">
          <Link to={`/dashboard/groups/${props.group._id}`}>
            <button className="group__button">
              <span>Go to group</span>
              <span className="arrow__icon">
                <IoMdArrowRoundForward />
              </span>
            </button>
          </Link>
          {props.currentUser._id === props.group.owner._id ? (
            <span
              className="group__information--delete "
              onClick={() => props.deleteGroup(props.group._id)}
              role="button"
            >
              <span className="delete__icon">
                <AiOutlineDelete />
              </span>
              <span>Delete Group</span>
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default GroupCard;
