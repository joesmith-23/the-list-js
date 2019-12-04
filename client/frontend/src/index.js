import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { createStore, applyMiddleware, compose, combineReducers } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import axios from "axios";

import dashboardReducer from "./store/reducers/dashboardReducer";
import authReducer from "./store/reducers/authReducer";
import userReducer from "./store/reducers/userReducer";
import uiReducer from "./store/reducers/uiReducer";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const rootReducer = combineReducers({
  auth: authReducer,
  dashboard: dashboardReducer,
  user: userReducer,
  ui: uiReducer
});

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk))
);

axios.interceptors.request.use(function(config) {
  const token = store.getState().auth.token;
  if (token) config.headers.Authorization = `Bearer ${token}`;

  return config;
});

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
