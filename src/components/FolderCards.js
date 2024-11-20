import React, {useState, useEffect, useRef} from 'react';
import Folder_icon from '../assets/folder_icon.png';
import more_vert from '../assets/more_vert.png';
import './FolderCards.css';

function FolderCards({ folderName, folderId, onRename, onDelete }) {
  const [showOptions, setShowOptions] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(folderName);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  const toggleOptions = (e) => {
    e.stopPropagation();
    setShowOptions((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(event.target) &&
        buttonRef.current && !buttonRef.current.contains(event.target)
      ) {
        setShowOptions(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleRename = () => {
    if (newName.trim() && newName !== folderName) {
      onRename(folderId, newName);
    }
    setIsRenaming(false);
    setShowOptions(false);
  };

  return (
    <div className="folderCard">
      <img src={Folder_icon} alt="folder_icon" className="FolderIcon" />
      <img
        src={more_vert}
        alt="more vert"
        className="more-vert-icon"
        onClick={toggleOptions}
        ref={buttonRef}
      />
      {isRenaming ? (
        <input
          type="text"
          className="rename-input"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onBlur={handleRename}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleRename();
            if (e.key === 'Escape') setIsRenaming(false);
          }}
        />
      ) : (
        <p className="folderName">{folderName}</p>
      )}
      {showOptions && (
        <div className="options-dropdown" ref={dropdownRef}>
          <button
            className="rename-option"
            onClick={() => {
              setIsRenaming(true);
              setShowOptions(false);
            }}
          >
            Rename
          </button>
          <button
            className="delete-option"
            onClick={() => {
              const confirmDelete = window.confirm(`Are you sure you want to delete "${folderName}"?`);
              if (confirmDelete) onDelete(folderId);
            }}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

export default FolderCards;
