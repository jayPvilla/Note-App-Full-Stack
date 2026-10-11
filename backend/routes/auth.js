
import dotenv from 'dotenv'
dotenv.config();
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import pool from '../db.js';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import { Router } from 'express';

const router = Router();

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'Strict' : 'Lax',
    maxAge: 30 * 2 * 60 * 1000, // 1 day
    domain: 'localhost'
}

const refresh_tokens = [];


// Registration (No JWT for now)
router.post('/auth/register', async (req, res) => {
    try {
        const { username, email, password } = req.body
        const salt = await bcrypt.genSalt()
        const hashed_password = await bcrypt.hash(password, salt)

        const usernameExists = await pool.query('SELECT * FROM tbl_users WHERE username = $1', [username]);
        const emailExists = await pool.query('SELECT * FROM tbl_users WHERE email = $1', [email]);

        if (usernameExists.rows.length > 0){
            return res.status(400).json({ message: 'Username already exists'})
        }

        if (emailExists.rows.length > 0){
            return res.status(400).json({ message: 'Email already exists'})
        }

        const insert_user = await pool.query('INSERT INTO tbl_users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email', [username, email, hashed_password])
        return res.json(insert_user.rows[0])
    } catch (err){
        console.error(err)
        res.status(500).json({ error: err })
    } 
})


// Login
router.post('/auth/login', async (req, res) => {
    try {
        const find_user = await pool.query('SELECT * FROM tbl_users WHERE username = $1', [req.body.username]);
        const user = find_user.rows[0];
        if (user) {
            if (await bcrypt.compare(req.body.password, user.password)) {
                console.log('Authenticated Successfully')
                // Once authenticated successfully, issue a jwt access token
                const token_payload = {  // For security consideration, create an object based on user object removing the sensitive data before integrating a jwt token
                    id: user.id,
                    username: user.username
                }
                const access_token = generateAccessToken(token_payload);
                const refresh_token = jwt.sign(token_payload, process.env.REFRESH_TOKEN_SECRET);
                refresh_tokens.push(refresh_token)
                // Respond to client the access token as cookie
                res.cookie('access_token', access_token, cookieOptions)
                return res.status(200).json({
                    message: 'Authenticated Successfully',
                    user: token_payload
                })
            } else {
                return res.status(401).send('Wrong Password');
            }
        } else {
            console.log('Account does not exist')
            return res.status(401).send('Account does not exist')
        }
    } catch (err) {
        console.error(err)
        return res.status(500).send('Server Error')
    }
})


router.post('/token', (req, res) => {
    const refresh_token = req.body.token
    if (refresh_token == null) return res.sendStatus(403);
    if (!refresh_tokens.includes(refresh_token)) return res.sendStatus(403);
    jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        const access_token = generateAccessToken({ username: user.username, id: user.id})
        res.json({ access_token: access_token});
    })
})

router.post('/logout', (req, res) => {
    res.cookie('access_token', '', {...cookieOptions, maxAge: 1});
    res.json({ message: 'Logged out successfully'});
})


export function generateAccessToken(user){
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
}

export default router;