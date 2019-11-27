import * as actionTypes from "./actionTypes";
import axios from "axios";

export const addGroupHandler = id => {
  return {
    type: actionTypes.ADD_GROUP
  };
};

export const addGroup = body => {
  return async dispatch => {
    try {
      const res = await axios.post("/api/groups/", body);
      if (res) dispatch(addGroupHandler());
    } catch (error) {
      dispatch(setErrorMessage(error.response.data.message));
    }
  };
};

export const deleteGroupHandler = id => {
  return {
    type: actionTypes.DELETE_GROUP,
    groupId: id
  };
};

export const deleteGroup = id => {
  return async dispatch => {
    try {
      dispatch(deleteGroupHandler(id));
      await axios.delete(`/api/groups/${id}`);
    } catch (error) {
      dispatch(setErrorMessage(error.response.data.message));
    }
  };
};

export const setGroups = groups => {
  return {
    type: actionTypes.SET_GROUPS,
    groups: groups
  };
};

export const setErrorMessage = error => {
  return {
    type: actionTypes.SET_ERROR,
    errorMessage: error
  };
};

export const initGroups = () => {
  return async dispatch => {
    try {
      const response = await axios.get("/api/groups/all-user-groups");
      let groupsData = response.data.data.groups;
      dispatch(setGroups(groupsData));
    } catch (error) {
      // dispatch(setErrorMessage("ERROR"));
      dispatch(setErrorMessage(error.response.data.message));
    }
  };
};

export const setCurrentGroup = group => {
  return {
    type: actionTypes.SET_CURRENT_GROUP,
    group: group
  };
};

export const setMembers = members => {
  return {
    type: actionTypes.SET_MEMBERS,
    members: members
  };
};

export const initCurrentGroup = props => {
  return async dispatch => {
    try {
      const response = await axios.get(`/api/groups/${props.match.params.id}`);
      let groupData = response.data.data.group;
      console.log(groupData);
      dispatch(setCurrentGroup(groupData));
    } catch (error) {
      // dispatch(setErrorMessage("ERROR"));
      dispatch(setErrorMessage(error));
    }
  };
};

//// LISTS ////

export const setLists = lists => {
  return {
    type: actionTypes.SET_LISTS,
    lists: lists
  };
};

export const initLists = props => {
  return async dispatch => {
    try {
      const response = await axios.get(`/api/lists/${props.match.params.id}`);
      let listData = response.data.data.lists;
      // console.log(listData);
      dispatch(setLists(listData));
    } catch (error) {
      // dispatch(setErrorMessage("ERROR"));
      dispatch(setErrorMessage(error.response.data.message));
    }
  };
};

export const setActiveList = list => {
  return {
    type: actionTypes.SET_ACTIVE_LIST,
    list
  };
};

export const addListHandler = newList => {
  return {
    type: actionTypes.ADD_LIST,
    newList: newList
  };
};

export const addList = body => {
  return async (dispatch, getState) => {
    const { dashboard } = getState();
    try {
      const res = await axios.post(
        `/api/lists/${dashboard.currentGroup._id}`,
        body
      );
      dispatch(addListHandler(res.data.data.list));
    } catch (error) {
      dispatch(setErrorMessage(error.response.data.message));
    }
  };
};

export const deleteListHandler = id => {
  return {
    type: actionTypes.DELETE_LIST,
    listId: id
  };
};

export const deleteList = id => {
  return async (dispatch, getState) => {
    const { dashboard } = getState();
    try {
      dispatch(deleteListHandler(id));
      // /api/lists/:group_id/:list_id
      await axios.delete(`/api/lists/${dashboard.currentGroup._id}/${id}`);
    } catch (error) {
      console.log(error);
      dispatch(setErrorMessage(error.response.data.message));
    }
  };
};

////// MEMBERS //////

export const addMemberHandler = member => {
  return {
    type: actionTypes.ADD_MEMBER,
    newMember: member
  };
};

export const addMember = body => {
  return async (dispatch, getState) => {
    const { dashboard } = getState();
    try {
      const res = await axios.post(
        // /api/groups/:group_id
        `/api/groups/${dashboard.currentGroup._id}`,
        body
      );
      dispatch(addMemberHandler(res.data.data.user));
    } catch (error) {
      dispatch(setErrorMessage(error.response.data.message));
    }
  };
};

export const deleteMemberHandler = id => {
  return {
    type: actionTypes.DELETE_MEMBER,
    memberId: id
  };
};

export const deleteMember = id => {
  return async (dispatch, getState) => {
    const { dashboard } = getState();
    try {
      // /api/groups/:group_id/:member_id
      await axios.delete(`/api/groups/${dashboard.currentGroup._id}/${id}`);
      dispatch(deleteMemberHandler(id));
    } catch (error) {
      dispatch(setErrorMessage(error.response.data.message));
    }
  };
};

export const setAverageRating = (rating, ratingList, itemId) => {
  return {
    type: actionTypes.SET_AVERAGE_RATING,
    rating,
    ratingList,
    itemId
  };
};

//// ITEMS ////

export const addItemHandler = newItem => {
  return {
    type: actionTypes.ADD_ITEM,
    newItem
  };
};

export const addItem = body => {
  return async (dispatch, getState) => {
    const { dashboard } = getState();
    try {
      // /api/lists/items/:group_id/:list_id
      const res = await axios.post(
        `/api/lists/items/${dashboard.currentGroup._id}/${dashboard.activeList._id}`,
        body
      );
      dispatch(addItemHandler(res.data.data.list.items[0]));
    } catch (error) {
      dispatch(setErrorMessage(error.response));
    }
  };
};

export const deleteItemHandler = itemId => {
  return {
    type: actionTypes.DELETE_ITEM,
    itemId
  };
};

export const deleteItem = itemId => {
  return async (dispatch, getState) => {
    const { dashboard } = getState();
    try {
      // /api/lists/items/:group_id/:list_id/:item_id
      await axios.delete(
        `/api/lists/items/${dashboard.currentGroup._id}/${dashboard.activeList._id}/${itemId}`
      );
      dispatch(deleteItemHandler(itemId));
    } catch (error) {
      console.log(error);
      dispatch(setErrorMessage(error.response));
    }
  };
};
