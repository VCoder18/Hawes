import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } fr  om 'react-router-dom';
import LoginForm from './components/LoginForm'; 
import SignupForm from './components/SignupForm';


export default App;
import "./App.css";
import { Route, Routes } from "react-router-dom";



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<div>Home</div>} />
      <Route path="/login" element={<div>Login</div>} />
      <Route path="/register" element={<div>Register</div>} />
      <Route path="/dashboard" element={<div>Dashboard</div>} />
      <Route path="/trips" element={<div>Trips</div>} />
      <Route path="/trips/:id" element={<div>Trip Details</div>} />
      <Route path="/create-trip" element={<div>Create Trip</div>} />
    </Routes>
  );
}

export default App;
