import * as actionTypes from "../actions/actionTypes";

const initialState = {
  token: "",
  error: ""
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.LOGIN_START:
      return {
        ...state
      };
    case actionTypes.REGISTER_START:
      return {
        ...state
      };
    case actionTypes.LOGIN_SUCCESS:
      return {
        ...state,
        token: action.token
      };
    case actionTypes.REGISTER_SUCCESS:
      return {
        ...state,
        token: action.token
      };
    case actionTypes.LOGIN_FAIL:
      return {
        ...state,
        error: action.errorMessage
      };
    case actionTypes.REGISTER_FAIL:
      return {
        ...state,
        error: action.errorMessage
      };
    case actionTypes.LOAD_LOCAL_AUTH:
      return {
        ...state,
        token: action.token
      };
    case actionTypes.SET_ERROR:
      return {
        ...state,
        error: action.errorMessage
      };
    case actionTypes.LOGOUT:
      return {
        ...state,
        token: null
      };
    default:
      return state;
  }
};

export default reducer;
