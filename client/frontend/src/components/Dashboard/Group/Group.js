import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";
// import { Link } from "react-router-dom";

import ItemContainer from "./Lists/Items/ItemContainer/ItemContainer";
import ListContainer from "./Lists/ListContainer";
import GroupSideBar from "./GroupSideBar/GroupSideBar";
import "./Group.css";

const Group = props => {
  const [group, setGroup] = useState({});
  const [lists, setLists] = useState([]);
  const [clickedListId, setClickedListId] = useState("");
  const [clickedListItems, setClickedListItems] = useState("");
  const [members, setMembers] = useState([]);
  const [offset, setOffset] = useState(0);

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

  const offsetHandler = offset => {
    setOffset(offset);
  };

  let renderGroupInfo = null;
  if (group) {
    renderGroupInfo = (
      <div className="lists__container">
        <GroupSideBar
          group={group}
          token={token}
          addMember={addMemberHandler}
          members={members}
          deleteMember={deleteMember}
        />
        <div className="main-content__container">
          <ListContainer
            lists={lists}
            clickedListHandler={clickedListHandler}
            deleteList={deleteList}
            token={token}
            group={group}
            newList={newListHandler}
            offsetHandler={offsetHandler}
          />
          <ItemContainer
            config={config}
            list={clickedListId}
            items={clickedListItems}
            token={token}
            groupId={group._id}
            newItemHandler={newItemHandler}
            deleteItem={deleteItemHandler}
            offset={offset}
          />
        </div>
      </div>
    );
  }

  return <Fragment>{renderGroupInfo}</Fragment>;
};

export default Group;
