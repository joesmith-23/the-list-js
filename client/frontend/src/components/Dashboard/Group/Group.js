import React, { useState, useEffect, Fragment } from "react";
import { connect } from "react-redux";

import * as dashboardActionCreators from "../../../store/actions/dashboardActionCreators";
import ItemContainer from "./Lists/Items/ItemContainer/ItemContainer";
import ListContainer from "./Lists/ListContainer";
import GroupSideBar from "./GroupSideBar/GroupSideBar";
import "./Group.css";

const Group = props => {
  const [clickedListId, setClickedListId] = useState("");
  const [offset, setOffset] = useState(0);

  // KEEPING THE BELOW FOR REFERENCE
  // const fetchLists = async () => {
  //   const response = await axios.get(`/api/lists/${props.match.params.id}`);
  //   let listData = response.data.data.lists;
  //   // console.log(listData);
  //   setLists([...listData]);
  // };

  // const deleteList = async id => {
  //   console.log(id);
  //   // /api/lists/:group_id/:list_id
  //   await axios.delete(`/api/lists/${props.currentGroup._id}/${id}`);
  //   setLists(prevList => prevList.filter(el => el._id !== id));
  // };

  // const deleteMember = async id => {
  //   console.log(id);
  //   console.log(props.currentGroup._id);
  //   // /api/groups/:group_id/:member_id
  //   try {
  //     await axios.delete(`/api/groups/${props.currentGroup._id}/${id}`);
  //     setMembers(prevList => prevList.filter(el => el._id !== id));
  //   } catch (error) {
  //     console.log(error.response.data.message);
  //   }
  // };

  useEffect(() => {
    if (props.token) {
      props.onInitCurrentGroup();
      props.onInitLists();
    }
  }, []);

  const clickedListHandler = list => {
    setClickedListId(list);
    props.onSetActiveList(list);
  };

  const deleteMemberHandler = id => {
    props.onDeleteMember(id);
  };

  const deleteListHandler = id => {
    props.onDeleteList(id);
  };

  const newItemHandler = newItem => {
    // setClickedListItems(prevItem => [...prevItem, newItem]);
  };

  const deleteItemHandler = itemId => {
    // setClickedListItems(prevItem => prevItem.filter(el => el._id !== itemId));
  };

  const offsetHandler = offset => {
    setOffset(offset);
  };

  let renderGroupInfo = null;
  if (props.currentGroup) {
    renderGroupInfo = (
      <div className="lists__container">
        <GroupSideBar
          group={props.currentGroup}
          owner={props.currentGroup.owner}
          token={props.token}
          members={props.currentGroup.members}
          deleteMember={deleteMemberHandler}
        />
        <div className="main-content__container">
          <ListContainer
            lists={props.lists}
            clickedListHandler={clickedListHandler}
            deleteList={deleteListHandler}
            offsetHandler={offsetHandler}
          />
          <ItemContainer
            list={clickedListId}
            items={props.activeItems}
            groupId={props.currentGroup._id}
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

const mapStateToProps = state => {
  return {
    token: state.auth.token,
    currentGroup: state.dashboard.currentGroup,
    lists: state.dashboard.lists,
    activeItems: state.dashboard.activeList.items
  };
};

const mapDispatchToProps = (dispatch, props) => {
  return {
    onInitCurrentGroup: () =>
      dispatch(dashboardActionCreators.initCurrentGroup(props)),
    onInitLists: () => dispatch(dashboardActionCreators.initLists(props)),
    onAddList: newList =>
      dispatch(dashboardActionCreators.addListHandler(newList)),
    onDeleteList: id => dispatch(dashboardActionCreators.deleteList(id)),
    onDeleteMember: id => dispatch(dashboardActionCreators.deleteMember(id)),
    onSetActiveList: list =>
      dispatch(dashboardActionCreators.setActiveList(list))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Group);
