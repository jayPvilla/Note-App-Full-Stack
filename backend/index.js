import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import notesRouter from './routes/notes.js';
import authRouter from './routes/auth.js'
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import pool from './db.js';


const app = express();
app.use(cookieParser());

app.use(cors({
    origin: 'http://localhost:5173', // Matches your frontend development URL exactly
    credentials: true                // Allows the browser to send/receive secure cookies
}));

app.use(express.json()); // Essential for parsing the Thunder Client JSON Body


// Mount the router
app.use('/', notesRouter); 
app.use('/', authRouter);



app.listen(5001, '0.0.0.0', () => {
    console.log('Server is running on port 5001');
});
