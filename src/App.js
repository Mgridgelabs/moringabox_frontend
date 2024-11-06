import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import './App.css'; // Assuming you have some global styles here

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
        </Routes>
      </Router>
    </div>
  );
}

export default App;
