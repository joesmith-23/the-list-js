import * as actionTypes from "../actions/actionTypes";

const initialState = {
  user: null,
  error: ""
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_USER:
      return {
        ...state,
        user: action.user
      };
    case actionTypes.REMOVE_USER:
      return {
        ...state,
        user: null
      };
    default:
      return state;
  }
};

export default reducer;
