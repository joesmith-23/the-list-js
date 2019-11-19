import * as actionTypes from "./actionsTypes";
import axios from "axios";

export const setCurrentUser = user => {
  return {
    type: actionTypes.SET_USER,
    user: user
  };
};

export const removeCurrentUser = () => {
  return {
    type: actionTypes.REMOVE_USER
  };
};

export const initUser = () => {
  return async (dispatch, getState) => {
    try {
      const response = await axios.get("/api/users/me");
      let user = response.data.data.user;
      console.log("USER FETCHED");
      dispatch(setCurrentUser(user));
    } catch (error) {
      dispatch(setErrorMessage(error.response.data.message));
    }
  };
};

export const setErrorMessage = error => {
  return {
    type: actionTypes.SET_ERROR,
    errorMessage: error
  };
};
