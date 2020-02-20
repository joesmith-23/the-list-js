import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { connect } from "react-redux";

import { AiOutlineDelete } from "react-icons/ai";
import { IoMdArrowRoundForward } from "react-icons/io";
import { FiUsers, FiList } from "react-icons/fi";

import "./GroupCard.css";

const GroupCard = props => {
  const [lists, setLists] = useState([]);

  const groupMembers = props.group.members.map(member => (
    <li key={member._id}>{member.firstName}</li>
  ));

  useEffect(() => {
    const fetchLists = async () => {
      const response = await axios.get(`/api/lists/${props.group._id}`);
      let listData = response.data.data.lists;
      setLists([...listData]);
    };
    let fetching = true;
    if (fetching) {
      fetchLists();
    }
    return () => (fetching = false);
    // eslint-disable-next-line
  }, []);

  let renderLists = null;
  if (lists) {
    renderLists = lists.map(list => <li key={list._id}>{list.name}</li>);
  }

  let deleteButton = null;
  if (props.currentUser && props.currentUser._id === props.group.owner._id) {
    deleteButton = (
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
    );
  } else {
    deleteButton = (
      <span
        className="group__information--delete "
        onClick={() => props.leaveGroup(props.group._id)}
        role="button"
      >
        <span className="delete__icon"></span>
        <span>Leave Group</span>
      </span>
    );
  }

  return (
    <div className="group__container">
      <div className="group__information--body">
        <div className="group__information--title">
          <h3>
            <Link to={`/dashboard/groups/${props.group._id}`}>
              {props.group.name}
            </Link>
          </h3>
          <p className="group__information--owner">
            Owner: {props.group.owner.firstName}
          </p>
        </div>
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
          {deleteButton}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    currentUser: state.user.user
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(GroupCard);
