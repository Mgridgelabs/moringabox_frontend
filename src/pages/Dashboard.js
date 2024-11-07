import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import NavBar from '../components/NavBar';
import background_img1 from '../assets/background_img1.png';
import trash_img from '../assets/trash_img.png';
import './Dashboard.css';

function Dashboard() {
  const location = useLocation();

  // Check if the current route is 'trash'
  const isTrashRoute = location.pathname.includes('trash');

  return (
    <div
      className="Dashboard-Container"
      style={{
        backgroundImage: isTrashRoute ? `url(${trash_img})` : `url(${background_img1})`, // Apply trash_img for Trash route
        backgroundSize: isTrashRoute ? '353px 353px' : 'cover', // Set size to 353x353 for Trash route, else 'cover' for others
        backgroundPosition: isTrashRoute ? 'center' : 'initial', // Center the image for Trash route
        backgroundRepeat: isTrashRoute ? 'no-repeat' : 'no-repeat', // Prevent repetition for Trash route
      }}
    >
      <NavBar />
      <div className="pageContent">
        {/* Outlet renders the nested routes (e.g., Home, Files) */}
        <Outlet />
      </div>
    </div>
  );
}

export default Dashboard;
