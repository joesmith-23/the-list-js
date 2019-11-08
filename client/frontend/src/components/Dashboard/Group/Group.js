import React, { useState, useEffect } from "react";
import axios from "axios";
// import { Link } from "react-router-dom";

import { FaTimes } from "react-icons/fa";

import AddList from "./Lists/AddList";
import AddMember from "./AddMember";
import ItemContainer from "./Lists/Items/ItemContainer/ItemContainer";
import "./Group.css";

const Group = props => {
  const [group, setGroup] = useState({});
  const [lists, setLists] = useState([]);
  const [clickedListId, setClickedListId] = useState("");
  const [clickedListItems, setClickedListItems] = useState("");
  const [members, setMembers] = useState([]);

  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  const fetchGroup = async () => {
    const response = await axios.get(
      `/api/groups/${props.match.params.id}`,
      config
    );
    let groupData = response.data.data.group;
    console.log(groupData);
    setGroup(groupData);
    setMembers(groupData.members);
  };

  const fetchLists = async () => {
    const response = await axios.get(
      `/api/lists/${props.match.params.id}`,
      config
    );
    let listData = response.data.data.lists;
    // console.log(listData);
    setLists([...listData]);
  };

  const deleteList = async id => {
    console.log(id);
    // /api/lists/:group_id/:list_id
    await axios.delete(`/api/lists/${group._id}/${id}`, config);
    setLists(prevList => prevList.filter(el => el._id !== id));
  };

  const deleteMember = async id => {
    console.log(id);
    console.log(group._id);
    // /api/groups/:group_id/:member_id
    try {
      await axios.delete(`/api/groups/${group._id}/${id}`, config);
      setMembers(prevList => prevList.filter(el => el._id !== id));
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  useEffect(() => {
    if (token) {
      fetchGroup();
      fetchLists();
    }
  }, []);

  const clickedListHandler = list => {
    setClickedListId(list);
    setClickedListItems(list.items);
  };

  const newListHandler = newList => {
    setLists(prevList => [...prevList, newList]);
  };

  const newItemHandler = newItem => {
    setClickedListItems(prevItem => [...prevItem, newItem]);
  };

  const deleteItemHandler = itemId => {
    setClickedListItems(prevItem => prevItem.filter(el => el._id !== itemId));
  };

  const addMemberHandler = newMember => {
    setMembers(prevMember => [...prevMember, newMember]);
  };

  let renderList = [];
  if (lists) {
    renderList = lists.map(list => (
      <li className="lists__card" key={list._id}>
        <span className="lists__name" onClick={() => clickedListHandler(list)}>
          {list.name}
        </span>
        <span className="spacer"></span>
        <span className="lists__delete" onClick={() => deleteList(list._id)}>
          <FaTimes />
        </span>
      </li>
    ));
  }

  let renderMembers = null;
  if (members) {
    renderMembers = members.map(member => (
      <li key={member._id}>
        <span>{member.firstName}</span>
        <span className="spacer"></span>
        <span
          className="lists__delete"
          onClick={() => deleteMember(member._id)}
        >
          <FaTimes />
        </span>
      </li>
    ));
  }

  let renderGroupInfo = null;
  if (group) {
    renderGroupInfo = (
      <div className="lists__container">
        <div>
          <h3>{group._id}</h3>
          <h3>{group.name}</h3>
          <AddMember token={token} group={group} addMember={addMemberHandler} />
          <ul>{renderMembers}</ul>
        </div>
        <div className="lists__information">
          <h4>Lists</h4>
          <ul>{renderList}</ul>
          <span>
            <AddList token={token} group={group} newList={newListHandler} />
          </span>
        </div>
        <div className="lists__contents">
          <ItemContainer
            config={config}
            list={clickedListId}
            items={clickedListItems}
            token={token}
            groupId={group._id}
            newItemHandler={newItemHandler}
            deleteItem={deleteItemHandler}
          />
        </div>
      </div>
    );
  }

  return <div>{renderGroupInfo}</div>;
};

export default Group;
