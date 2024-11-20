import React, { useEffect, useState } from 'react';
import FolderCards from './FolderCards';
import FileRows from './FileRows';
import './Home.css';
import axios from 'axios';

function Home() {
  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]);
  const [filesError, setFilesError] = useState('');
  const [foldersError, setFoldersError] = useState('');

  // Fetch Files
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          'https://cloudy-wiwu.onrender.com/api/recents/files',
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setFiles(response.data.recent_files);
      } catch (err) {
        console.error(err);
        setFilesError('Failed to fetch files');
      }
    };
    fetchFiles();
  }, []);

  // Fetch Folders
  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          'https://cloudy-wiwu.onrender.com/api/recents/folders',
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setFolders(response.data.recent_folders);
      } catch (err) {
        console.error(err);
        setFoldersError('Failed to fetch folders');
      }
    };
    fetchFolders();
  }, []);

  return (
    <div className="home-Content">
      <h1 id="home-Title">Welcome To Drive</h1>
      <div className="searchDiv">
        <h2 id="search-title">Search</h2>
        <input name="search field" placeholder="search text" />
      </div>
      <div className="foldersDiv">
        <h1 id="folders-title">Folders</h1>
        <div className="folder-cards">
          {foldersError ? (
            <p>{foldersError}</p>
          ) : folders.length > 0 ? (
            folders.map((folder) => (
              <FolderCards key={folder.id} folderName={folder.name} />
            ))
          ) : (
            <p>No Folders Found</p>
          )}
        </div>
      </div>
      <div className="filesDiv">
        <h1 id="files-title">Files</h1>
        <div className="files-container">
          <table className="files-table">
            <thead>
              <tr>
                <th className="file-icon"></th>
                <th className="file-name">Name</th>
                <th className="file-location">Location</th>
                <th className="file-options"></th>
              </tr>
            </thead>
            <tbody>
              {filesError ? (
                <tr>
                  <td colSpan="4">{filesError}</td>
                </tr>
              ) : files.length > 0 ? (
                files.map((file) => <FileRows key={file.id} file={file} />)
              ) : (
                <tr>
                  <td colSpan="4">No Files Uploaded</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Home;
