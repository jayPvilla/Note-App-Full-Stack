import jwt from 'jsonwebtoken';
import pool from './db.js'; // Ensure the .js extension is present

export async function authenticateToken(req, res, next) {
    try {
        const token = req.cookies.access_token;
        if (!token) {
            return res.status(401).json({ message: "Not authorized, no token" });
        }

        // 1. Verify synchronously to assign the payload directly to 'decoded'
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        } catch (err) {
            return res.status(403).json({ message: "Not authorized, token invalid" });
        }

        // 2. decoded.id is now fully accessible for the query
        const user = await pool.query("SELECT id, username, email FROM tbl_users WHERE id = $1", [decoded.id]);
        
        if (user.rows.length === 0) {
            return res.status(401).json({ message: "Not authorized, user not found" });
        }

        // 3. Set req.user cleanly and move to the route
        req.user = user.rows[0];
        next();
    } catch (err) {
        console.error("Middleware Error:", err);
        res.status(401).json({ message: "Not authorized, token failed" });
    }
}
