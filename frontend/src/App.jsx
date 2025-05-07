import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import AllCourses from './pages/AllCourses'
import TempPaymentPage from './pages/TempPaymentPage'
import PaymentSuccessPage from './pages/PaymentSuccessPage'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AllCourses />} />
        <Route path="/payment" element={<TempPaymentPage />} />
        <Route path="/payment-success" element={<PaymentSuccessPage />} />
      </Routes>
    </Router>
  )
}

export default App
