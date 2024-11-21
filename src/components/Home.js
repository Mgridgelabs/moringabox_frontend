import React, { useState, useEffect } from 'react';
import FolderCards from './FolderCards';
import './Home.css';
import supabase from '../supabase';
import axios from 'axios';

function Home() {
  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]);
  const [filesError, setFilesError] = useState('');
  const [foldersError, setFoldersError] = useState('');

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setFilesError('User not logged in. Please log in to view files.');
          return;
        }

        const { data, error } = await supabase
          .storage
          .from('bucket')
          .list('files', {
            limit: 10,
            offset: 0,
          });

        if (error) {
          setFilesError(error.message);
        } else {
          setFiles(data);
          setFilesError('');
        }
      } catch (err) {
        setFilesError('Failed to fetch files.');
      }
    };

    fetchFiles();
  }, []);

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

  // Handle the drop event to move the file to a new folder
  const handleFileMove = async (fileId, folderId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `https://cloudy-wiwu.onrender.com/api/folders/move_file/${fileId}`,
        { new_folder_id: folderId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert('File moved successfully');
    } catch (err) {
      console.error('Failed to move file:', err);
      alert('An error occurred while moving the file.');
    }
  };

  // Define renameFolder function
  const renameFolder = async (folderId, newFolderName) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `https://cloudy-wiwu.onrender.com/api/folders/rename/${folderId}`,
        { new_name: newFolderName },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert('Folder renamed successfully');
    } catch (err) {
      console.error('Failed to rename folder:', err);
      alert('An error occurred while renaming the folder.');
    }
  };

  // Define deleteFolder function
  const deleteFolder = async (folderId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `https://cloudy-wiwu.onrender.com/api/folders/${folderId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert('Folder deleted successfully');
      // Remove the deleted folder from the state
      setFolders(folders.filter((folder) => folder.id !== folderId));
    } catch (err) {
      console.error('Failed to delete folder:', err);
      alert('An error occurred while deleting the folder.');
    }
  };

  return (
    <div className="home-Content">
      <h1 id="home-Title">Welcome To Drive</h1>
      <div className="foldersDiv">
        <h1 id="folders-title">Folders</h1>
        <div className="folder-cards">
          {foldersError ? (
            <p>{foldersError}</p>
          ) : folders.length > 0 ? (
            folders.map((folder) => (
              <FolderCards
                key={folder.id}
                folderName={folder.name}
                folderId={folder.id}
                onRename={renameFolder} // Pass rename function
                onDelete={deleteFolder} // Pass delete function
                onDrop={handleFileMove} // Pass the file move function
              />
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
                <th className="file-location">Size (KB)</th>
                <th className="file-options">Uploaded Date</th>
              </tr>
            </thead>
            <tbody>
              {filesError ? (
                <tr>
                  <td colSpan="4">{filesError}</td>
                </tr>
              ) : files.length > 0 ? (
                files.map((file, index) => (
                  <tr
                    key={index}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('fileId', file.id);
                    }}
                  >
                    <td></td>
                    <td>{file.name}</td>
                    <td>{(file.size / 1024).toFixed(2)} KB</td>
                    <td>{new Date(file.created_at).toLocaleString()}</td>
                  </tr>
                ))
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
