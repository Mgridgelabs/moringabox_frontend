import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from '../components/NavBar';
import './Dashboard.css';

function Dashboard() {
  return (
    <div className="Dashboard-Container">
      <NavBar />
      <div className="pageContent">
        {/* Outlet renders the nested routes (e.g., Home, Files) */}
        <Outlet />
      </div>
    </div>
  );
}

export default Dashboard;
