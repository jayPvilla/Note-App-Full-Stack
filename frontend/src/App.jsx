import { useState, useEffect, use } from 'react'
import './App.css'
import AddNote from './components/AddNote'
import NoteCatalog from './components/NoteCatalog';
import axios from 'axios'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';


function App() {

  return (
    <Router>
      <Routes>
        <Route path='/' element={ <Login/> } />
        <Route path='/home' element={ <Home/> } />
        <Route path='/auth/register' element={ <Register/> } />
        <Route path='/auth/login' element={ <Login /> } />
      </Routes>
    </Router>
  )
}

export default App
