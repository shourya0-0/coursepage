import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import AllCourses from './pages/AllCourses'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AllCourses />} />
      </Routes>
    </Router>
  )
}

export default App
