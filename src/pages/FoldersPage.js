import React, { useState, useEffect } from 'react';
// import Header from '../components/Header';
import FileFolderContent from '../components/FileFolderContent';
import './FoldersPage.css';
import { Folder, ArrowLeft } from 'lucide-react';
import axios from 'axios';

const FoldersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null); // Selected folder state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('User is not authenticated');
          setLoading(false);
          return;
        }

        const response = await axios.get('/api/recents/folders', {
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

  // Fetch files when a folder is selected
  // useEffect(() => {
  //   if (selectedFolder) {
  //     const fetchFiles = async () => {
  //       try {
  //         const token = localStorage.getItem('token');
  //         setLoading(true);

  //         const response = await axios.get(`url`, {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //             'Content-Type': 'application/json',
  //           },
  //         });

  //         setFiles(response.data.files);
  //       } catch (err) {
  //         setError(err.response?.data?.msg || 'Failed to fetch files');
  //       } finally {
  //         setLoading(false);
  //       }
  //     };

  //     fetchFiles();
  //   }
  // }, [selectedFolder]);

  const handleFolderClick = (folder) => {
    setSelectedFolder(folder);
    setError('');
  };

  const handleBackToFolders = () => {
    setSelectedFolder(null);
    setFiles([]);
    setError('');
  };

  // Filtered list of folders based on search term
  const filteredFolders = folders.filter(folder =>
    folder.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="folder-page-container">
      {selectedFolder ? (
        // Display files for the selected folder
        <div>
          <div className="icon-and-title">
            <ArrowLeft className="icon back-icon" onClick={handleBackToFolders} />
            <h2>{selectedFolder.name} - Files</h2>
          </div>
          {loading ? (
            <p>Loading files...</p>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : files.length > 0 ? (
            <FileFolderContent items={files} itemType="file" />
          ) : (
            <p>No files found in this folder.</p>
          )}
        </div>
      ) : (
        // Display folders list
        <div>
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

          {/* Display folders */}
          {loading ? (
            <p>Loading folders...</p>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : filteredFolders.length > 0 ? (
            <FileFolderContent
              items={filteredFolders}
              itemType="folder"
              onItemClick={handleFolderClick} // Pass click handler to FileFolderContent
            />
          ) : (
            <p>No folders found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default FoldersPage;
