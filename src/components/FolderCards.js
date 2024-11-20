import React, { useState, useRef, useEffect } from 'react';
import Folder_icon from '../assets/folder_icon.png';
import more_vert from '../assets/more_vert.png';
import './FolderCards.css';

function FolderCards({ folderName }) {
  const [showOptions, setShowOptions] = useState(false);
  const dropdownRef = useRef(null);  // Reference to the dropdown
  const buttonRef = useRef(null);     // Reference to the more_vert button

  // Toggle the dropdown visibility
  const toggleOptions = (e) => {
    e.stopPropagation();  // Prevents the event from propagating to the document
    setShowOptions((prev) => !prev);
  };

  // Close the dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(event.target) && 
        buttonRef.current && !buttonRef.current.contains(event.target)
      ) {
        setShowOptions(false);
      }
    };

    // Add event listener for clicks outside
    document.addEventListener('click', handleClickOutside);

    // Clean up the event listener on component unmount
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className="folderCard">
      <img src={Folder_icon} alt="folder_icon" className="FolderIcon" />
      <img
        src={more_vert}
        alt="more vert"
        className="more-vert-icon"
        onClick={toggleOptions}
        ref={buttonRef} // Reference for the button to stop event propagation
      />
      <p className="folderName">{folderName}</p>

      {/* Dropdown menu for options */}
      {showOptions && (
        <div className="options-dropdown" ref={dropdownRef}>
          <button className="rename-option">Rename</button>
          <button className="delete-option">Delete</button>
        </div>
      )}
    </div>
  );
}

export default FolderCards;
