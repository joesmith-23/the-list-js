import React, { Fragment, useState } from "react";
import axios from "axios";

const Register = props => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    passwordConfirm: "",
    token: ""
  });

  let {
    firstName,
    lastName,
    email,
    password,
    passwordConfirm,
    token
  } = formData;

  const onChange = e =>
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  const onSubmit = async e => {
    e.preventDefault();
    if (password !== passwordConfirm) {
      console.log("Passwords do not match");
    } else {
      const newUser = {
        firstName,
        lastName,
        email,
        password,
        passwordConfirm
      };

      try {
        const config = {
          headers: {
            "Content-Type": "application/json"
          }
        };

        const body = JSON.stringify(newUser);

        const res = await axios.post("/api/users", body, config);

        token = res.data.token;

        localStorage.setItem("token", token);

        props.history.push("/dashboard");
      } catch (error) {
        console.error(error.response.data);
      }
    }
  };

  return (
    <Fragment>
      <h1>Register</h1>
      <form onSubmit={e => onSubmit(e)}>
        <input
          type="text"
          placeholder="First Name"
          name="firstName"
          value={firstName}
          onChange={e => onChange(e)}
          required
        />
        <input
          type="text"
          placeholder="Last Name"
          name="lastName"
          value={lastName}
          onChange={e => onChange(e)}
          required
        />
        <input
          type="email"
          placeholder="Email Address"
          name="email"
          value={email}
          onChange={e => onChange(e)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          name="password"
          value={password}
          onChange={e => onChange(e)}
          minLength="6"
        />
        <input
          type="password"
          placeholder="Confirm Password"
          name="passwordConfirm"
          value={passwordConfirm}
          onChange={e => onChange(e)}
          minLength="6"
        />
        <input type="submit" value="Register" />
      </form>
    </Fragment>
  );
};

export default Register;
