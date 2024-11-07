import React from 'react';
import Folder_icon from '../assets/folder_icon.png';
import more_vert from '../assets/more_vert.png';
import './FolderCards.css';

function FolderCards() {
  return (
      <div className="folderCard">
        <img src={Folder_icon} alt="folder_icon" className="FolderIcon" />
        <img src={more_vert} alt="more vert" className="more-vert-icon" />
        <p className="folderName">FolderName</p>
      </div>
  );
}

export default FolderCards;
