import { useState, useEffect, use } from 'react'
import '../App.css'
import AddNote from '../components/AddNote'
import NoteCatalog from '../components/NoteCatalog';
import axios from 'axios'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


function Home() {

  const [notes, set_note] = useState([]);

  const fetch_note = async () => {
    try {
      const response = await axios.get('http://localhost:5001/note');
      set_note(response.data)
      console.log(response)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetch_note();
  }, [])

  return (
    <>
      <div className='page'>
        <div className='container'>
          <AddNote notes={notes} set_note={set_note}/>
          <NoteCatalog notes={notes} set_note={set_note}/>
        </div>
      </div>
    </>
  )
}

export default Home
