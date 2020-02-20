import React, { Fragment, useState } from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";

import * as authActionCreators from "../../store/actions/authActionCreators";

import Loading from "../utils/Loading/Loading";

import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import "./Login.css";

const Login = props => {
  // Data State
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    token: ""
  });

  // UI State
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [hidden, setHidden] = useState(true);

  let { email, password } = formData;

  const onChange = e =>
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  const onSubmit = async e => {
    e.preventDefault();
    props.onLogin(email, password, props);
  };

  const emailFocusHandler = () => {
    if (formData.email) {
      setEmailFocused(true);
    } else {
      setEmailFocused(!emailFocused);
    }
  };

  const passwordFocusHandler = () => {
    if (formData.password) {
      setPasswordFocused(true);
    } else {
      setPasswordFocused(!passwordFocused);
    }
  };

  const setHiddenHandler = () => {
    setHidden(!hidden);
  };

  return (
    <Fragment>
      {props.isLoading ? (
        <Loading />
      ) : (
        <div className="container">
          <div className="login__container">
            <h1 className="login__title">Welcome</h1>
            <form
              className="login__form"
              onSubmit={e => onSubmit(e)}
              action="/"
            >
              <div className="login__input">
                <input
                  className={emailFocused ? "focus" : ""}
                  onFocus={() => emailFocusHandler()}
                  onBlur={() => emailFocusHandler()}
                  type="email"
                  name="email"
                  value={email}
                  onChange={e => onChange(e)}
                  required
                />
                <span data-placeholder="Email Address"></span>
              </div>
              <div className="login__input">
                <input
                  className={passwordFocused ? "focus" : ""}
                  onFocus={() => passwordFocusHandler()}
                  onBlur={() => passwordFocusHandler()}
                  type={hidden ? "password" : "text"}
                  name="password"
                  value={password}
                  onChange={e => onChange(e)}
                />
                <span data-placeholder="Password"></span>
                <span
                  className="password__hidden"
                  onClick={() => setHiddenHandler()}
                >
                  {hidden ? <FaRegEye /> : <FaRegEyeSlash />}
                </span>
              </div>
              <input className="login__button" type="submit" value="LOGIN" />
            </form>
            <small className="login__signup">
              Don't have an account? <Link to="/register">Sign Up</Link>
            </small>
          </div>
        </div>
      )}
    </Fragment>
  );
};

const mapStateToProps = state => {
  return {
    isLoading: state.isLoading.loading
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onLogin: (email, password, props) =>
      dispatch(authActionCreators.login(email, password, props))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Login));
