import * as actionTypes from "./actionsTypes";
import axios from "axios";

export const addGroupHandler = id => {
  return {
    type: actionTypes.ADD_GROUP
  };
};

export const addGroup = body => {
  return async (dispatch, getState) => {
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
  return async (dispatch, getState) => {
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
  return async (dispatch, getState) => {
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
