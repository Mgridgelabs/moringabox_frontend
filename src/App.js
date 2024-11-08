import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import Home from './components/Home';
import New from './components/New';
import FilesPage from './pages/FilesPage';
import FoldersPage from './pages/FoldersPage';
import Recents from './components/Recents';
import Trash from './components/Trash';
import './App.css';

function App() {
  return (
    <div className="app-container">
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

          {/* Define dashboard route with nested routes */}
          <Route path="/dashboard" element={<Dashboard />}>
            {/* Redirect to home by default when visiting /dashboard */}
            <Route index element={<Navigate to="home" />} />
            <Route path="home" element={<Home />} />
            <Route path="files" element={<FilesPage />} />
            <Route path="folders" element={<FoldersPage />} />
            <Route path="recents" element={<Recents />} />
            <Route path="trash" element={<Trash />} />
            <Route path="new" element={<New />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
