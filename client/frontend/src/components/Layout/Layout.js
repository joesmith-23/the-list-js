import React, { Component, Fragment } from "react";
import { Route } from "react-router-dom";
import NavBar from "./Header/NavBar";
import Footer from "./Footer/Footer";
import Landing from "../Static/Landing";
import Dashboard from "../Dashboard/Dashboard";
import Register from "../Auth/Register";
import Login from "../Auth/Login";
import Group from "../Dashboard/Group/Group";

export class Layout extends Component {
  state = {
    userAuthenticated: false
  };

  render() {
    return (
      <Fragment>
        <NavBar />
        <main className="main-container">
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
  }
}

export default Layout;
