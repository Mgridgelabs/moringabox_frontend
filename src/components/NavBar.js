import React from 'react';
import { Link } from 'react-router-dom';
import image2 from '../assets/image _copy.png';
import newLogo from '../assets/new_logo.png';
import homeLogo from '../assets/home_logo.png';
import filesLogo from '../assets/files_logo.png';
import foldersLogo from '../assets/folders_logo.png';
import recentsLogo from '../assets/recents_logo.png';
import trashLogo from '../assets/trash_logo.png';
import './NavBar.css';

function NavBar() {
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
    </div>
  );
}

export default NavBar;
