import React, { useState, Fragment, useEffect } from "react";
import { connect } from "react-redux";
import { Route } from "react-router-dom";
import NavBar from "./Header/NavBar";
import Footer from "./Footer/Footer";
import Landing from "../Static/Landing";
import Dashboard from "../Dashboard/Dashboard";
import Register from "../Auth/Register";
import Login from "../Auth/Login";
import Group from "../Dashboard/Group/Group";

import { FaTimes } from "react-icons/fa";

import * as dashboardActionCreators from "../../store/actions/dashboardActionCreators";
import * as userActionCreators from "../../store/actions/userActionCreators";
import * as authActionCreators from "../../store/actions/authActionCreators";

const Layout = props => {
  const [errorMessage, setErrorMessage] = useState();
  const [show, setShow] = useState(false);

  useEffect(() => {
    setErrorMessage("");
  }, []);

  useEffect(() => {
    if (props.userError) {
      setErrorMessage(props.userError);
      setShow(true);
      props.onRemoveErrorUser("");
    }
    if (props.authError) {
      setErrorMessage(props.authError);
      setShow(true);
      props.onRemoveErrorAuth("");
    }
    if (props.dashboardError) {
      setErrorMessage(props.dashboardError);
      setShow(true);
      props.onRemoveErrorDashboard("");
    }
  }, [
    props.userError,
    props.authError,
    props.dashboardError,
    errorMessage,
    props
  ]);

  return (
    <Fragment>
      <NavBar />
      <main className="main-container">
        {show && (
          <div className="error-container">
            {errorMessage}
            <span className="error-cancel" onClick={() => setShow(false)}>
              <FaTimes />
            </span>
          </div>
        )}
        <Route exact path="/" component={Landing} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/dashboard" component={Dashboard} />
        <Route
          exact
          path={"/dashboard/groups/:id"}
          // render={props => <Group {...props} />}
          component={Group}
        />
      </main>
      <Footer />
    </Fragment>
  );
};

const mapStateToProps = state => {
  return {
    userError: state.user.error,
    authError: state.auth.error,
    dashboardError: state.dashboard.error
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onRemoveErrorDashboard: error =>
      dispatch(dashboardActionCreators.setErrorMessage(error)),
    onRemoveErrorUser: error =>
      dispatch(userActionCreators.setErrorMessage(error)),
    onRemoveErrorAuth: error =>
      dispatch(authActionCreators.setErrorMessage(error))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Layout);
