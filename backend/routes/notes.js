// routes/notes.js
import { Router } from 'express';
import pool from '../db.js';
import { authenticateToken } from '../middleware.js';


const router = Router();


// 1. CREATE A NOTE (Tied to logged-in user)
router.post('/note', authenticateToken, async (req, res) => {
    try {
        const { title, content, color, date, status } = req.body;
        const userId = req.user.id; // Extracted from JWT token

        const newNote = await pool.query(
            'INSERT INTO tbl_notes (title, content, color, date, status, user_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [title, content, color, date, status, userId]
        );
        res.json(newNote.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send(err.message);
    }
});


// 2. GET ALL NOTES (Only for the logged-in user)
router.get('/note', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id; // Extracted from JWT token
        
        const notes = await pool.query(
            'SELECT * FROM tbl_notes WHERE user_id = $1', 
            [userId]
        );
        res.json(notes.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send(err.message);
    }
});


// 3. UPDATE A NOTE (Ensures user owns the note)
router.put('/note', authenticateToken, async (req, res) => {
    try {
        const { id, content } = req.body;
        const userId = req.user.id;

        const updated_note = await pool.query(
            'UPDATE tbl_notes SET content = $1 WHERE id = $2 AND user_id = $3 RETURNING *',
            [content, id, userId]
        );
        
        if (updated_note.rows.length === 0) {
            return res.status(404).json({ message: "Note not found or unauthorized" });
        }
        res.json(updated_note.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send(err.message);
    }
});


// 4. DELETE A NOTE (Ensures user owns the note)
router.delete('/note/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const deleted_note = await pool.query(
            'DELETE FROM tbl_notes WHERE id = $1 AND user_id = $2 RETURNING *',
            [id, userId]
        );

        if (deleted_note.rows.length === 0) {
            return res.status(404).json({ message: "Note not found or unauthorized" });
        }
        res.json({ message: "Note deleted successfully", note: deleted_note.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).send(err.message);
    }
});


export default router;
