import React, { Fragment, useState, useEffect } from 'react';
import axios from 'axios';

const Landing = () => {

const [state, setState] = useState({
    _id: '',
    firstName: '',
    lastName: '',
    email: '',
    token: ''
});

let { _id, token } = state;

useEffect(() => {
    setState({
        token: localStorage.getItem('token')
    })
}, []);

const getUserData = async e => {
    try {

        token = localStorage.getItem('token');
        
        const config = {
            headers: {
                'Content-Type': 'application/json' ,
                'x-auth-token': token
            }
        }

        const res = await axios.get('/api/users/auth', config);

        const { _id, firstName, lastName, email } = res.data;

        setState({
            ...state,
            _id,
            firstName,
            lastName,
            email
        })

    } catch (error) {
        console.error(error.response.data)
    }
} 

const clearUserData = e => {
    setState({
        ...state,
        _id: '',
        firstName: '',
        lastName: '',
        email: ''
    })
}


    return (
        <Fragment>
            <div onClick={e => getUserData()}>
                <Fragment>{token ? <button>Get logged in user</button> : null}</Fragment>
            </div>
            <p>{ state._id }</p>
            <p>{ state.firstName }</p>
            <p>{ state.lastName }</p>
            <p>{ state.email }</p>
            <div onClick={e => clearUserData()}>
                <Fragment>{_id ? <button>Clear data</button> : null}</Fragment>
            </div>
        </Fragment>
    )
}

export default Landing
