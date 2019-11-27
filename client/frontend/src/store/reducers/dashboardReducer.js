import * as actionTypes from "../actions/actionTypes";

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

const setAverageRating = (state, action) => {
  const activeItems = state.activeList.items;
  let newArray = [];
  if (state.activeList.items)
    newArray = activeItems.map(item => {
      if (item._id === action.itemId) {
        item.averageRating = parseFloat(action.rating);
        item.rating = action.ratingList;
      }
      return item;
    });
  return newArray;
};

const addItem = (state, action) => {
  const newState = { ...state };
  let newListOfLists = { ...newState.lists };

  const activeListId = state.activeList._id;
  newListOfLists = state.lists.map(list => {
    if (list._id === activeListId) {
      list.items.unshift(action.newItem);
    }
    return list;
  });
  return newListOfLists;
};

const deleteItem = (state, action) => {
  const activeListId = state.activeList._id;
  let newListOfLists = state.lists.map(list => {
    if (list._id === activeListId) {
      list.items = list.items.filter(el => el._id !== action.itemId);
    }
    return list;
  });
  return newListOfLists;
};

const deleteList = (state, action) => {
  const newLists = state.lists.filter(el => el._id !== action.listId);
  return newLists;
};

const deleteGroup = (state, action) => {
  const newGroups = state.groups.filter(el => el._id !== action.groupId);
  return newGroups;
};

const deleteMember = (state, action) => {
  const newMembers = state.currentGroup.members.filter(
    el => el._id !== action.memberId
  );
  return newMembers;
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.ADD_GROUP:
      return {
        ...state
      };
    case actionTypes.SET_GROUPS:
      return {
        ...state,
        groups: action.groups
      };
    case actionTypes.SET_CURRENT_GROUP:
      return {
        ...state,
        currentGroup: action.group
      };
    case actionTypes.SET_LISTS:
      return {
        ...state,
        lists: action.lists
      };
    case actionTypes.SET_ACTIVE_LIST:
      return {
        ...state,
        activeList: action.list
      };
    case actionTypes.SET_AVERAGE_RATING:
      return {
        ...state,
        activeList: {
          ...state.activeList,
          items: setAverageRating(state, action)
        }
      };
    case actionTypes.ADD_LIST:
      return {
        ...state,
        lists: [...state.lists, action.newList]
      };
    case actionTypes.ADD_ITEM:
      return {
        ...state,
        lists: addItem(state, action)
      };
    case actionTypes.DELETE_LIST:
      return {
        ...state,
        lists: deleteList(state, action),
        activeList: {}
      };
    case actionTypes.SET_MEMBERS:
      return {
        ...state,
        members: action.members
      };
    case actionTypes.ADD_MEMBER:
      return {
        ...state,
        currentGroup: {
          ...state.currentGroup,
          members: [...state.currentGroup.members, action.newMember]
        }
      };
    case actionTypes.SET_ERROR:
      return {
        ...state,
        error: action.errorMessage
      };
    case actionTypes.DELETE_GROUP:
      return {
        ...state,
        groups: deleteGroup(state, action)
      };
    case actionTypes.DELETE_ITEM:
      return {
        ...state,
        lists: deleteItem(state, action)
      };
    case actionTypes.DELETE_MEMBER:
      return {
        ...state,
        currentGroup: {
          ...state.currentGroup,
          members: deleteMember(state, action)
        }
      };

    default:
      return state;
  }
};

export default reducer;
