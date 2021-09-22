import React, { useState, useContext } from 'react'
import { Link, useHistory } from 'react-router-dom';

import { UserContext } from '../utils/UserContext';
import { registerUser } from '../services/auth';

function Register() {

    const [username, setUserName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [password_two, setPassword_two] = useState();

    const {isAuth, setisAuth} = useContext(UserContext);

    let history = useHistory();

    const handleSubmit = (e)=> {
        e.preventDefault();
        if (password !== password_two){
            window.alert("Error passwords do not match");
        } else {
            const registered = registerUser(username, email, password);
            if (registered == true){
                setisAuth(true);
                history.push("/");
            } else {
                history.push("/register");
            }
        }
    };

    return (
        <div className="container pt-5">
        <div className="card">
        <div className="card-content">
            <h3 className="title is-3">Register to Discord Clone</h3>
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
                type="email" 
                placeholder="Email"
                id="email"
                name="email"
                onChange={e=>setEmail(e.target.value)}
                />
            <span className="icon is-small is-left">
                <i className="material-icons">email</i>
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
                onChange={e=>setPassword(e.target.value)}
                />
            <span className="icon is-small is-left">
                <i className="material-icons">lock</i>
            </span>
            </p>
            </div>
            <div className="field">
            <p className="control has-icons-left">
                <input className="input" 
                type="password" 
                placeholder="Confirm Password"
                id="password_two"
                name="password_two"
                onChange={e=>setPassword_two(e.target.value)}
                />
            <span className="icon is-small is-left">
                <i className="material-icons">lock</i>
            </span>
            </p>
            </div>
            <div class="field">
            <p class="control">
                <button type="submit" class="button is-success">Register
                    <i className="material-icons right">send</i>
                </button>
            </p>
            <br></br>
            <p>
               Already have an account ? <Link to="/login">Log in</Link> 
            </p>
            </div>
            </form>
        </div>
        </div>
    </div>
    )
}

export default Register
