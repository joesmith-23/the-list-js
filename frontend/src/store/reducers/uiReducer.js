import * as actionTypes from "../actions/actionTypes";

const initialState = {
  mobileSidebarOpen: false,
  backdropActive: false
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.TOGGLE_MOBILE_SIDEBAR:
      return {
        ...state,
        mobileSidebarOpen: !state.mobileSidebarOpen,
        backdropActive: !state.backdropActive
      };
    default:
      return state;
  }
};

export default reducer;
