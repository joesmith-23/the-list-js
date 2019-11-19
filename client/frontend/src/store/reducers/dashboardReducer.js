import * as actions from "../actions/actionsTypes";

const initialState = {
  groups: [],
  errorMessage: ""
};

// Deep immutability examples
// return {
//   ...state,
//   currentUser: {
//     ...state.currentUser,
//     name: 'Blah Blah Blah',
//     [action.something]: state.currentUser[action.something]
//   }
// }

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.ADD_GROUP:
      return {
        ...state
      };
    case actions.SET_GROUPS:
      return {
        ...state,
        groups: action.groups
      };
    case actions.SET_ERROR:
      return {
        ...state,
        error: action.errorMessage
      };
    case actions.DELETE_GROUP:
      const newGroups = state.groups.filter(el => el._id !== action.groupId);
      return {
        ...state,
        groups: newGroups
      };

    default:
      return state;
  }
};

export default reducer;
