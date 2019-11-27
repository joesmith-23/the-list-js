import * as actionTypes from "./actionTypes";
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
  return async dispatch => {
    try {
      const response = await axios.get("/api/users/me");
      let user = response.data.data.user;
      let localUser = JSON.stringify(user);
      localStorage.setItem("user", localUser);
      dispatch(setCurrentUser(user));
    } catch (error) {
      dispatch(setErrorMessage(error.response.data.message));
    }
  };
};

export const initUserFromLocal = () => {
  return async dispatch => {
    let user = localStorage.getItem("user");
    user = JSON.parse(user);
    dispatch(setCurrentUser(user));
  };
};

export const setErrorMessage = error => {
  return {
    type: actionTypes.SET_ERROR,
    errorMessage: error
  };
};
