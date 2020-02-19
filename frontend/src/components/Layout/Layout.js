import React, { useState, Fragment, useEffect } from "react";
import { connect } from "react-redux";
import { Route, withRouter, Switch } from "react-router-dom";
import NavBar from "./Header/NavBar/NavBar";
import Footer from "./Footer/Footer";
import Landing from "../Static/Landing";
import About from "../Static/About";
import Dashboard from "../Dashboard/Dashboard";
import Register from "../Auth/Register";
import Login from "../Auth/Login";
import Group from "../Dashboard/Group/Group";
import NoPage from "../Static/NoPage";

import ErrorMessage from "../utils/UI/ErrorMessage/ErrorMessage";
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
    // return () => {
    //   setShow(false);
    // };
  }, [
    props.userError,
    props.authError,
    props.dashboardError,
    errorMessage,
    props
  ]);

  const setShowHandler = show => {
    setShow(show);
  };

  return (
    <Fragment>
      <title>The List</title>
      <NavBar />
      <main
        className={
          props.location.pathname !== "/"
            ? "main-container"
            : "main-container__landing"
        }
      >
        {show && (
          <ErrorMessage errorMessage={errorMessage} setShow={setShowHandler} />
        )}
        <Switch>
          <Route exact path="/" component={Landing} />
          <Route exact path="/about" component={About} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/dashboard" component={Dashboard} />
          <Route
            exact
            path={"/dashboard/groups/:id"}
            // render={props => <Group {...props} />}
            component={Group}
          />
          <Route component={NoPage} />
        </Switch>
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Layout));
