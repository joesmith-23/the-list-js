import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import * as authActionCreators from "../../store/actions/authActionCreators";

import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import "./Register.css";

const Register = props => {
  // Data state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    passwordConfirm: ""
  });

  // UI state
  const [firstNameFocused, setFirstNameFocused] = useState(false);
  const [lastNameFocused, setLastNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [passwordConfirmFocused, setPasswordConfirmFocused] = useState(false);

  const [passwordHidden, setPasswordHidden] = useState(true);
  const [passwordConfirmHidden, setPasswordConfirmHidden] = useState(true);

  let { firstName, lastName, email, password, passwordConfirm } = formData;

  const onChange = e =>
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  const onSubmit = async e => {
    e.preventDefault();
    const newUser = {
      firstName,
      lastName,
      email,
      password,
      passwordConfirm
    };

    const body = JSON.stringify(newUser);
    props.onRegister(body, props);
  };

  const firstNameFocusHandler = () => {
    if (formData.firstName) {
      setFirstNameFocused(true);
    } else {
      setFirstNameFocused(!firstNameFocused);
    }
  };

  const lastNameFocusHandler = () => {
    if (formData.lastName) {
      setLastNameFocused(true);
    } else {
      setLastNameFocused(!lastNameFocused);
    }
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

  const passwordConfirmFocusHandler = () => {
    if (formData.passwordConfirm) {
      setPasswordConfirmFocused(true);
    } else {
      setPasswordConfirmFocused(!passwordConfirmFocused);
    }
  };

  const setPasswordHiddenHandler = () => {
    setPasswordHidden(!passwordHidden);
  };

  const setPasswordConfirmHiddenHandler = () => {
    setPasswordConfirmHidden(!passwordConfirmHidden);
  };

  return (
    <Fragment>
      <div className="container">
        <div className="register__container">
          <h1 className="register__title">Register</h1>
          <form className="register__form" onSubmit={e => onSubmit(e)}>
            <div className="register__input">
              <input
                className={firstNameFocused ? "focus" : ""}
                onFocus={() => firstNameFocusHandler()}
                onBlur={() => firstNameFocusHandler()}
                type="text"
                name="firstName"
                value={firstName}
                onChange={e => onChange(e)}
                required
              />
              <span data-placeholder="First Name"></span>
            </div>
            <div className="register__input">
              <input
                className={lastNameFocused ? "focus" : ""}
                onFocus={() => lastNameFocusHandler()}
                onBlur={() => lastNameFocusHandler()}
                type="text"
                name="lastName"
                value={lastName}
                onChange={e => onChange(e)}
                required
              />
              <span data-placeholder="Last Name"></span>
            </div>
            <div className="register__input">
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
            <div className="register__input">
              <input
                className={passwordFocused ? "focus" : ""}
                onFocus={() => passwordFocusHandler()}
                onBlur={() => passwordFocusHandler()}
                type={passwordHidden ? "password" : "text"}
                name="password"
                value={password}
                onChange={e => onChange(e)}
                minLength="6"
              />
              <span data-placeholder="Password"></span>
              <span
                className="password__hidden"
                onClick={() => setPasswordHiddenHandler()}
              >
                {passwordHidden ? <FaRegEye /> : <FaRegEyeSlash />}
              </span>
            </div>
            <div className="register__input">
              <input
                className={passwordConfirmFocused ? "focus" : ""}
                onFocus={() => passwordConfirmFocusHandler()}
                onBlur={() => passwordConfirmFocusHandler()}
                type={passwordConfirmHidden ? "password" : "text"}
                name="passwordConfirm"
                value={passwordConfirm}
                onChange={e => onChange(e)}
                minLength="6"
              />
              <span data-placeholder="Confirm Password"></span>
              <span
                className="password__hidden"
                onClick={() => setPasswordConfirmHiddenHandler()}
              >
                {passwordConfirmHidden ? <FaRegEye /> : <FaRegEyeSlash />}
              </span>
            </div>
            <input
              className="register__button"
              type="submit"
              value="REGISTER"
            />
          </form>
          <small className="register__login">
            Already have an account <Link to="/login">Log in</Link>
          </small>
        </div>
      </div>
    </Fragment>
  );
};

const mapDispatchToProps = dispatch => {
  return {
    onRegister: (body, props) =>
      dispatch(authActionCreators.register(body, props))
  };
};

export default connect(null, mapDispatchToProps)(Register);
