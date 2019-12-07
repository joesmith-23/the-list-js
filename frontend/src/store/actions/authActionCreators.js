import * as actionTypes from "./actionTypes";
import axios from "axios";

export const logout = () => {
  return {
    type: actionTypes.LOGOUT
  };
};

export const loginStart = () => {
  return {
    type: actionTypes.LOGIN_START
  };
};

export const loginSuccess = token => {
  return {
    type: actionTypes.LOGIN_SUCCESS,
    token: token
  };
};

export const loginFail = error => {
  return {
    type: actionTypes.LOGIN_FAIL,
    errorMessage: error
  };
};

export const login = (email, password, props) => {
  return async dispatch => {
    dispatch(loginStart());
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };
    const user = {
      email,
      password
    };
    try {
      const body = JSON.stringify(user);

      const loginData = await axios.post("/api/users/login", body, config);
      const token = loginData.data.token;
      dispatch(loginSuccess(token));

      localStorage.setItem("token", token);

      props.history.push("/dashboard");
    } catch (error) {
      dispatch(loginFail(error.response.data.message));
    }
  };
};

export const registerStart = () => {
  return {
    type: actionTypes.REGISTER_START
  };
};

export const registerSuccess = token => {
  return {
    type: actionTypes.REGISTER_SUCCESS,
    token
  };
};

export const registerFail = error => {
  return {
    type: actionTypes.REGISTER_FAIL,
    errorMessage: error
  };
};

export const register = (body, props) => {
  return async dispatch => {
    dispatch(registerStart());
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };
    try {
      const res = await axios.post("/api/users", body, config);
      const token = res.data.token;
      dispatch(registerSuccess(token));
      localStorage.setItem("token", token);
      props.history.push("/dashboard");
    } catch (error) {
      dispatch(registerFail(error.response.data.message));
    }
  };
};

export const loadLocalAuth = token => {
  return {
    type: actionTypes.LOAD_LOCAL_AUTH,
    token: token
  };
};

export const setErrorMessage = error => {
  return {
    type: actionTypes.SET_ERROR,
    errorMessage: error
  };
};
