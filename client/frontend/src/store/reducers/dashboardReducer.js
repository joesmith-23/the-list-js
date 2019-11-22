import * as actions from "../actions/actionsTypes";

const initialState = {
  groups: [],
  currentGroup: {},
  lists: [],
  activeList: {},
  error: ""
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
    case actions.SET_CURRENT_GROUP:
      return {
        ...state,
        currentGroup: action.group
      };
    case actions.SET_LISTS:
      return {
        ...state,
        lists: action.lists
      };
    case actions.SET_ACTIVE_LIST:
      return {
        ...state,
        activeList: action.list
      };
    case actions.ADD_LIST:
      return {
        ...state,
        lists: [...state.lists, action.newList]
      };
    case actions.DELETE_LIST:
      const newLists = state.lists.filter(el => el._id !== action.listId);
      return {
        ...state,
        lists: newLists,
        activeList: {}
      };
    case actions.SET_MEMBERS:
      return {
        ...state,
        members: action.members
      };
    case actions.ADD_MEMBER:
      return {
        ...state,
        currentGroup: {
          ...state.currentGroup,
          members: [...state.currentGroup.members, action.newMember]
        }
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
    case actions.DELETE_MEMBER:
      const newMembers = state.currentGroup.members.filter(
        el => el._id !== action.memberId
      );
      return {
        ...state,
        currentGroup: {
          ...state.currentGroup,
          members: newMembers
        }
      };

    default:
      return state;
  }
};

export default reducer;
