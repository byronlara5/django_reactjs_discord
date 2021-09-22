import React, { useState, useContext } from 'react'
import { Link, useHistory } from 'react-router-dom';

import { UserContext } from '../utils/UserContext';
import { loginUser, setAxiosAuthToken, setToken, getCurrentUser, unsetCurrentUser } from '../services/auth';

function Login() {

    const [username, setUserName] = useState();
    const [password, setPassword] = useState();
    const {isAuth, setisAuth} = useContext(UserContext);
    
    let history = useHistory();

    const handleSubmit = (e)=> {
        e.preventDefault();
        loginUser(username, password)
        .then(response =>{
            const auth_token = response;
            setAxiosAuthToken(auth_token);
            setToken(auth_token);
            getCurrentUser();
            setisAuth(true);
            history.push("/");

        })
        .catch(error => {
            unsetCurrentUser();
            window.alert("Login Error " + error);
        });
    };

    return (
    <div className="container pt-5">
        <div className="card">
        <div className="card-content">
            <h3 className="title is-3">Discord Clone</h3>
            <form onSubmit={handleSubmit}>
            <div className="field">
            <p className="control has-icons-left">
                <input className="input" 
                type="text" 
                placeholder="Username"
                id="username"
                name="username"
                onChange={e=>setUserName(e.target.value)}
                />
            <span className="icon is-small is-left">
                <i className="material-icons">person</i>
            </span>
            </p>
            </div>
            <div className="field">
            <p className="control has-icons-left">
                <input className="input" 
                type="password" 
                placeholder="Password" 
                id="password"
                name="password"
                onChange={e=> setPassword(e.target.value)}
                />
                <span className="icon is-small is-left">
                <i className="material-icons">lock</i>
                </span>
            </p>
            </div>
            <div className="field">
            <p className="control">
                <button type="submit" className="button is-success">Login
                    <i className="material-icons right">send</i>
                </button>
            </p>
            <br></br>
            <p>
               Don't have an account ? <Link to="/register">Register</Link> 
            </p>
            </div>
            </form>
        </div>
        </div>
    </div>
    )
}

export default Login
