import * as actions from "../actions/actionsTypes";

const initialState = {
  token: "",
  error: ""
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.LOGIN_START:
      return {
        ...state
      };
    case actions.LOGIN_SUCCESS:
      return {
        ...state,
        token: action.token
      };
    case actions.LOGIN_FAIL:
      return {
        ...state,
        error: action.errorMessage
      };
    case actions.LOAD_LOCAL_AUTH:
      return {
        ...state,
        token: action.token
      };
    case actions.SET_ERROR:
      return {
        ...state,
        error: action.errorMessage
      };
    case actions.LOGOUT:
      return {
        ...state,
        token: null
      };
    default:
      return state;
  }
};

export default reducer;
