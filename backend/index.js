import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import notesRouter from './routes/notes.js';
import authRouter from './routes/auth.js'
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import pool from './db.js';


const app = express();

app.use(cors());
app.use(express.json()); // Essential for parsing the Thunder Client JSON Body


// Mount the router
app.use('/', notesRouter); 
app.use('/', authRouter);



const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});