import React from 'react'
import { useState } from 'react';
import '../App.css'
import axios from 'axios';
import { Link } from 'react-router-dom';

const Login = () => {

  const [username, set_username] = useState("");
  const [password, set_password] = useState("");

  async function login() {

    const user = {
      username: username,
      password: password
    };

    try {
      const response = await axios.post('http://localhost:5001/auth/login', user);
      alert(response)
      console.log(response)
      return
    } catch (err) {
      console.error(err)
      return
    }
  }

  return (
    <div className='container-card' id='add-note-container'>
      <header>
        <i className="fa-regular fa-note-sticky icon" />
        <h1>Login</h1>
      </header>

      <input
        type="text"
        className="title-input"
        placeholder="Username"
        onChange={(e) => set_username(e.target.value)}
        value={username}
      />
      <input
        type="password"
        className="title-input"
        placeholder="Password"
        onChange={(e) => set_password(e.target.value)}
        value={password}
      />
      <Link to="/home" className="add-btn" onClick={login}>Login</Link>
      <a><u>No account yet? Register here.</u></a>
    </div>
  );
}

export default Login