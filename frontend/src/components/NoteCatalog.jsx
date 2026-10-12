import React, { useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5001/note'

const NoteCatalog = ({ notes, set_note }) => {

  const [editingId, setEditingId] = useState(null);



  const handleTextChange = (id, newContent) => {
    const updatedNotes = notes.map(note => 
      note.id === id ? { ...note, content: newContent } : note
    );
    set_note(updatedNotes);
  };

  const saveEdit = async (id) => {
    const noteToSave = notes.find(note => note.id === id);
    if (!noteToSave) return;
    try {
      const response = await axios.put(API_URL, noteToSave);
      console.log('Saved successfully:', response);
    } catch (err) {
      console.error('Failed to save update:', err);
    }
  };


  async function deleteNote(id){
    const updated_notes = notes.filter(note => note.id !== id)
    try {
      const response = await axios.delete(`${API_URL}/${id}`, {
        data: {
          id: id
        }
      })
      set_note(updated_notes)
      console.log(response)
    } catch (err){
      console.error(err)
    }
  }

  return (
    <ul className='catalog'>
      {notes.map(item => {
        const isEditing = editingId === item.id;

        return (
          <li key={item.id} className='note'>
            <div className={`container-card catalog-note ${isEditing ? 'editing-catalog-note' : ''}`} style={{ borderTop: `4px solid ${item.color}` }}>
              <h4 className='catalog-title'>{item.title}</h4>
              <textarea
                value={item.content}
                className={`content-text-area catalog-text-area ${isEditing ? 'editing-text-area' : ''}`}
                readOnly={!isEditing}
                onChange={(e) => handleTextChange(item.id, e.target.value)}
                autoFocus={isEditing}
              />
              <div className='catalog-note-footer'>
                <p className='catalog-note-date'>{item.date}</p>
                <div className={`catalog-note-buttons ${isEditing ? 'editing-catalog-note-buttons' : ''}`}>
                  <button
                    className='catalog-note-edit'
                    onClick={() => {
                      if (isEditing){
                        saveEdit(item.id);
                        setEditingId(null)
                      } else {
                        setEditingId(item.id)
                      }
                    }}
                  >
                    <i className={`fa-solid ${isEditing ? 'fa-check' : 'fa-pen-to-square'} icon`} />
                  </button>
                  <button className='catalog-note-delete' onClick={() => deleteNote(item.id)}>
                    <i className="fa-solid fa-trash icon" />
                  </button>
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default NoteCatalog;
