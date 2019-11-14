import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import "./Login.css";

const Login = props => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    token: ""
  });
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [hidden, setHidden] = useState(true);

  let { email, password, token } = formData;

  const onChange = e =>
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  const onSubmit = async e => {
    e.preventDefault();
    const user = {
      email,
      password
    };
    try {
      const config = {
        headers: {
          "Content-Type": "application/json"
        }
      };

      const body = JSON.stringify(user);

      const res = await axios.post("/api/users/login", body, config);

      token = res.data.token;

      localStorage.setItem("token", token);

      props.history.push("/dashboard");
    } catch (error) {
      console.error(error.response.data);
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

  const setHiddenHandler = () => {
    setHidden(!hidden);
  };

  return (
    <Fragment>
      <div className="container">
        <div className="login__container">
          <h1 className="login__title">Welcome</h1>
          <form className="login__form" onSubmit={e => onSubmit(e)} action="/">
            <div className="login__input">
              <input
                className={emailFocused ? "focus" : ""}
                onFocus={() => emailFocusHandler()}
                onBlur={() => emailFocusHandler()}
                type="email"
                // placeholder="Email Address"
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
    </Fragment>
  );
};

export default Login;
