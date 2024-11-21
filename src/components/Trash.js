import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import './Trash.css';

function Trash() {
  const [trashedFolders, setTrashedFolders] = useState([]);
  const [error, setError] = useState('');
  const dropdownRefs = useRef([]);

  useEffect(() => {
    const fetchTrashedFolders = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://cloudy-wiwu.onrender.com/api/trash/folders', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTrashedFolders(response.data.folders);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch trashed folders');
      }
    };

    fetchTrashedFolders();
  }, []);

  const handleRestore = async (folderId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `https://cloudy-wiwu.onrender.com/api/trash/restore/folder/${folderId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTrashedFolders((prev) => prev.filter((folder) => folder.id !== folderId));
      alert('Folder restored successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to restore the folder.');
    }
  };

  const handleDeletePermanently = async (folderId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://cloudy-wiwu.onrender.com/api/trash/folder/${folderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTrashedFolders((prev) => prev.filter((folder) => folder.id !== folderId));
      alert('Folder deleted permanently.');
    } catch (err) {
      console.error(err);
      alert('Failed to delete the folder permanently.');
    }
  };

  const toggleDropdown = (index) => {
    dropdownRefs.current.forEach((dropdown, idx) => {
      if (dropdown) dropdown.style.display = idx === index && dropdown.style.display !== 'block' ? 'block' : 'none';
    });
  };

  return (
    <div className="trash-container">
      
      {error && <p className="error">{error}</p>}
      <div className="trashed-folders">
        {trashedFolders.length > 0 ? (
          trashedFolders.map((folder, index) => (
            <div key={folder.id} className="trashed-folder-card">
              <p>{folder.name}</p>
              <button onClick={() => toggleDropdown(index)}>⋮</button>
              <div
                className="options-dropdown"
                ref={(el) => (dropdownRefs.current[index] = el)}
                onClick={(e) => e.stopPropagation()} // Prevent document click from hiding the dropdown
              >
                <button onClick={() => handleRestore(folder.id)}>Restore</button>
                <button onClick={() => handleDeletePermanently(folder.id)}>Delete Permanently</button>
              </div>
            </div>
          ))
        ) : (
          <p>No trashed folders available.</p>
        )}
      </div>
    </div>
  );
}

export default Trash;
