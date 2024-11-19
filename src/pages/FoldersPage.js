import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import FileFolderContent from '../components/FileFolderContent';
import './FoldersPage.css';
import { Folder } from 'lucide-react';
import axios from 'axios';

const FoldersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const token = localStorage.getItem('token'); // Assume token is stored in localStorage
        if (!token) {
          setError('User is not authenticated');
          setLoading(false);
          return;
        }

        const response = await axios.get('http://localhost:5000/api/recents/folders', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        setFolders(response.data.recent_folders);
      } catch (err) {
        setError(err.response?.data?.msg || 'Failed to fetch folders');
      } finally {
        setLoading(false);
      }
    };

    fetchFolders();
  }, []);

  // Filtered list of folders based on search term
  const filteredFolders = folders.filter(folder =>
    folder.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="folder-page-container">
      <div className="icon-and-title">
        <Folder className="icon" />
        <h2>Folders</h2>
      </div>

      {/* Search Bar */}
      <div className="filters">
        <input
          type="text"
          placeholder="Search folders..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Display loading, error, or folders */}
      {loading ? (
        <p>Loading folders...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <FileFolderContent items={filteredFolders} itemType="folder" />
      )}
    </div>
  );
};

export default FoldersPage;
