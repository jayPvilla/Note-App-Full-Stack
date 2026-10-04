import React from 'react'
import '../App.css'
import axios from 'axios';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const Register = () => {
    
    const [username, set_username] = useState("");
    const [email, set_email] = useState("");
    const [password, set_password] = useState("");
    const [confirmPassword, set_confirmPassword] = useState("");

    async function register(e){
        if (e) e.preventDefault();

        if (!username || !email || !password || !confirmPassword) {
            alert("Missing field");
            return;
        }

        if (password !== confirmPassword) {
            alert("Password didn't match");
            return;
        }

        const new_user = {
            username: username,
            email: email,
            password: password
        };

        try {
            const response = await axios.post('http://localhost:5001/auth/register', new_user);
            
            alert("Registration successful!");
            set_username("");
            set_email("");
            set_password("");
            set_confirmPassword("");
            
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                alert(err.response.data.message);
            } else {
                alert("Something went wrong with the server.");
            }
            console.error(err);
        }
    }

    return (
        <div className='container-card' id='add-note-container'>
            <header>
                <i className="fa-regular fa-note-sticky icon" />
                <h1>Create an Account</h1>
            </header>

            <form onSubmit={register} style={{ display: 'contents' }}>
                <input
                    type="text"
                    className="title-input"
                    placeholder="Username"
                    onChange={(e) => set_username(e.target.value)}
                    value={username}
                />
                <input
                    type="email"
                    className="title-input"
                    placeholder="Email"
                    onChange={(e) => set_email(e.target.value)}
                    value={email}
                />
                <input
                    type="password"
                    className="title-input"
                    placeholder="Password"
                    onChange={(e) => set_password(e.target.value)}
                    value={password}
                />
                <input
                    type="password"
                    className="title-input"
                    placeholder="Confirm Password"
                    onChange={(e) => set_confirmPassword(e.target.value)}
                    value={confirmPassword}
                />
                {/* Changed onClick to type="submit" to pair with the form */}
                <button type="submit" className="add-btn">Register</button>
            </form>
            <Link to="/auth/login"><u>Already have an account, Log-in</u></Link>
        </div>
    );
}

export default Register;
