import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import './App.css';

function App() {
  return (
    <div className="app-container">
      {/* Wrap your Routes with BrowserRouter (Router) */}
      <Router>
        <Routes>
          {/* Redirect root path to /landing */}
          <Route path="/" element={<Navigate to="/landing" />} />

          {/* Define the route for /landing */}
          <Route path="/landing" element={<LandingPage />} />

          {/* Define the route for /register */}
          <Route path="/register" element={<RegisterPage />} />

          {/* Define the route for /login */}
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
