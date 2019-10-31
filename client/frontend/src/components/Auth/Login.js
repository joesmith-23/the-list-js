import React, { Fragment, useState } from 'react';
import axios from 'axios';

const Login = props => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    token: ''
  });

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
          'Content-Type': 'application/json'
        }
      };

      const body = JSON.stringify(user);

      const res = await axios.post('/api/users/login', body, config);

      token = res.data.token;

      localStorage.setItem('token', token);

      props.history.push('/dashboard');
    } catch (error) {
      console.error(error.response.data);
    }
  };

  return (
    <Fragment>
      <h1>Login</h1>
      <form onSubmit={e => onSubmit(e)} action="/">
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
        />
        <input type="submit" value="Log In" />
      </form>
    </Fragment>
  );
};

export default Login;
