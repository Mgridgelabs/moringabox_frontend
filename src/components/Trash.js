import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import './Trash.css';

function Trash() {
  const [trashedFolders, setTrashedFolders] = useState([]);
  const [trashedFiles, setTrashedFiles] = useState([]);
  const [error, setError] = useState('');
  const dropdownRefs = useRef([]);

  useEffect(() => {
    const fetchTrashedItems = async () => {
      try {
        const token = localStorage.getItem('token');
        const [foldersResponse, filesResponse] = await Promise.all([
          axios.get('https://cloudy-wiwu.onrender.com/api/trash/folders', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('https://cloudy-wiwu.onrender.com/api/trash/files', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setTrashedFolders(foldersResponse.data.folders);
        setTrashedFiles(filesResponse.data.files);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch trashed items');
      }
    };

    fetchTrashedItems();
  }, []);

  const handleRestoreFolder = async (folderId) => {
    // Similar to the folder restore logic provided earlier
  };

  const handleDeleteFolderPermanently = async (folderId) => {
    // Similar to the folder delete logic provided earlier
  };

  const handleRestoreFile = async (fileId) => {
    // File restore logic
  };

  const handleDeleteFilePermanently = async (fileId) => {
    // File delete logic
  };

  const toggleDropdown = (index) => {
    dropdownRefs.current.forEach((dropdown, idx) => {
      if (dropdown) dropdown.style.display = idx === index && dropdown.style.display !== 'block' ? 'block' : 'none';
    });
  };

  return (
    <div className="trash-container">
      <h1>Trash</h1>
      {error && <p className="error">{error}</p>}

      <div className="trashed-folders">
        <h2>Trashed Folders</h2>
        {trashedFolders.length > 0 ? (
          trashedFolders.map((folder, index) => (
            <div key={folder.id} className="trashed-folder-card">
              <p>{folder.name}</p>
              <button onClick={() => toggleDropdown(index)}>⋮</button>
              <div className="options-dropdown" ref={(el) => (dropdownRefs.current[index] = el)}>
                <button onClick={() => handleRestoreFolder(folder.id)}>Restore</button>
                <button onClick={() => handleDeleteFolderPermanently(folder.id)}>Delete Permanently</button>
              </div>
            </div>
          ))
        ) : (
          <p>No trashed folders available.</p>
        )}
      </div>

      <div className="trashed-files">
        <h2>Trashed Files</h2>
        {trashedFiles.length > 0 ? (
          trashedFiles.map((file, index) => (
            <div key={file.id} className="trashed-file-card">
              <p>{file.name}</p>
              <button onClick={() => toggleDropdown(index + trashedFolders.length)}>⋮</button>
              <div className="options-dropdown" ref={(el) => (dropdownRefs.current[index + trashedFolders.length] = el)}>
                <button onClick={() => handleRestoreFile(file.id)}>Restore</button>
                <button onClick={() => handleDeleteFilePermanently(file.id)}>Delete Permanently</button>
              </div>
            </div>
          ))
        ) : (
          <p>No trashed files available.</p>
        )}
      </div>
    </div>
  );
}

export default Trash;
