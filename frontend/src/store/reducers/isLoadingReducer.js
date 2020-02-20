import * as actionTypes from "../actions/actionTypes";

const initialState = {
  isLoading: false
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.IS_LOADING:
      return {
        isLoading: action.isLoading
      };

    default:
      return state;
  }
};

export default reducer;
