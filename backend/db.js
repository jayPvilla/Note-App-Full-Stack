import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Prioritize DATABASE_URL if available (perfect for Docker)
const pool = process.env.DATABASE_URL
    ? new Pool({ connectionString: process.env.DATABASE_URL })
    : new Pool({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT
      });

pool.on("connect", () => {
    console.log("Database connected successfully.");
});

pool.on("error", (err) => {
    console.error("Database error: ", err);
});

export default pool;
