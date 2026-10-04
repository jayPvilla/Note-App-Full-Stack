import React, { useState } from 'react';
import axios from 'axios';

const AddNote = ({ notes, set_note }) => {
    const [note_content, set_content] = useState("");
    const [note_title, set_title] = useState("");
    const [selectedColor, set_note_color] = useState('#7b6825');

    const colors = [
        { name: 'color1', hex: '#fada83' },
        { name: 'color2', hex: '#fdf98b' },
        { name: 'color3', hex: '#cfcfcf' },
        { name: 'color4', hex: '#fba990' }
    ];

    async function add_note() {

        const new_note = {
            title: note_title,
            content: note_content,
            color: selectedColor,
            date: new Date().toLocaleDateString('en-US', {
                month: 'long',
                day: '2-digit',
                year: 'numeric'
            }).replace(',', ''), 
            status: "Pending"
        };

        try {
            const response = await axios.post('http://localhost:5001/note', new_note);
            set_note([...notes, new_note])
            console.log(response)
        } catch (err) {
            console.error(err)
        }

    }

    return (
        <div className='container-card' id='add-note-container'>
            <header>
                <i className="fa-regular fa-note-sticky icon" />
                <h1>ADD NOTE</h1>
            </header>
            
            <input
                type="text"
                className="title-input"
                placeholder="Enter a title..."
                onChange={(e) => set_title(e.target.value)}
                value={note_title}
            />
            <textarea
                className="content-text-area content-input"
                placeholder="Enter a content..."
                onChange={(e) => set_content(e.target.value)}
                value={note_content}
            ></textarea>
            <div className="color-picker" style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                {colors.map((c) => (
                    <button
                        key={c.name}
                        type="button"
                        className={`color-dot ${selectedColor === c.hex ? 'active' : ''}`}
                        style={{ 
                            backgroundColor: c.hex,
                            width: '25px',
                            height: '25px',
                            borderRadius: '50%',
                            border: selectedColor === c.hex ? '3px solid white' : '1px solid rgba(255,255,255,0.2)',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            transform: selectedColor === c.hex ? 'scale(1.2)' : 'scale(1)'
                        }}
                        onClick={() => set_note_color(c.hex)}
                    />
                ))}
            </div>
            
            <button className="add-btn" onClick={add_note}>Add Note</button>
        </div>
    );
};

export default AddNote;
