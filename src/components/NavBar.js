import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import image2 from '../assets/image _copy.png';
import newLogo from '../assets/new_logo.png';
import homeLogo from '../assets/home_logo.png';
import filesLogo from '../assets/files_logo.png';
import foldersLogo from '../assets/folders_logo.png';
import recentsLogo from '../assets/recents_logo.png';
import trashLogo from '../assets/trash_logo.png';
import logoutIcon from '../assets/logout_icon.png'; // Add a logout icon
import StorageIndicator from './Storage'; // Import the StorageIndicator component
import './NavBar.css';

function NavBar() {
  const navigate = useNavigate();

  // Function to handle logout
  const handleLogout = () => {
    // Clear the session data
    localStorage.removeItem('token'); 
    // Navigate to the landing page
    navigate('/landing');
  };

  return (
    <div className="navBar">
      <img src={image2} alt="logo" id="logo2" />
      <Link to="/dashboard/new">
        <img src={newLogo} alt="new" id="newLogo" />
      </Link>
      <Link to="/dashboard/home">
        <img src={homeLogo} alt="home" id="homeLogo" />
      </Link>
      <Link to="/dashboard/files">
        <img src={filesLogo} alt="files" id="filesLogo" />
      </Link>
      <Link to="/dashboard/folders">
        <img src={foldersLogo} alt="folders" id="foldersLogo" />
      </Link>
      <Link to="/dashboard/recents">
        <img src={recentsLogo} alt="recents" id="recentsLogo" />
      </Link>
      <Link to="/dashboard/trash">
        <img src={trashLogo} alt="trash" id="trashLogo" />
      </Link>
      
      {/* Add StorageIndicator component below the Trash icon */}
      <div className="storage-wrapper">
        <StorageIndicator />
      </div>

      <img
        src={logoutIcon}
        alt="logout"
        id="logoutIcon"
        onClick={handleLogout}
        style={{ cursor: 'pointer' }}
      />
    </div>
  );
}

export default NavBar;
