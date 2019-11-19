import * as actions from "../actions/actionsTypes";

const initialState = {
  user: null
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.SET_USER:
      return {
        ...state,
        user: action.user
      };
    case actions.REMOVE_USER:
      return {
        ...state,
        user: null
      };
    default:
      return state;
  }
};

export default reducer;
