React, {useEffect, useState} from 'react';
import FolderCards from './FolderCards';
import './Home.css';
import supabase from '../supabase'; // Import the Supabase client
import axios from 'axios'; // Add the axios import

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
        if (!token) {
          setFilesError('User not logged in. Please log in to view files.');
          return;
        }

        const { data, error } = await supabase
          .storage
          .from('bucket') // Replace 'bucket' with your actual bucket name
          .list('files', {
            limit: 10, // Limit the number of files if needed
            offset: 0,
          });

        if (error) {
          setFilesError(error.message);
        } else {
          setFiles(data);
          setFilesError(''); // Clear any previous errors
        }
      } catch (err) {
        setFilesError('Failed to fetch files.');
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
            headers: { Authorization: Bearer ${token} },
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

  // Rename Folder
  const renameFolder = async (id, newName) => {
    try {
      const token = localStorage.getItem('token');
  
      // Send the request to the backend
      const response = await axios.put(
        https://cloudy-wiwu.onrender.com/api/folders/update_name/${id},
        { new_name: newName }, // Use "new_name" as required by the API
        {
          headers: { Authorization: Bearer ${token} },
        }
      );
  
      // Update the folders state optimistically
      setFolders((prevFolders) =>
        prevFolders.map((folder) =>
          folder.id === id ? { ...folder, name: response.data.new_name } : folder
        )
      );
    } catch (err) {
      console.error('Failed to rename folder:', err);
  
      // Display appropriate error to the user
      if (err.response && err.response.status === 404) {
        alert('Folder not found or access denied');
      } else if (err.response && err.response.status === 400) {
        alert('New folder name is required');
      } else {
        alert('An unexpected error occurred. Please try again.');
      }
    }
  };

  const deleteFolder = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(https://cloudy-wiwu.onrender.com/api/folders/${id}, {
        headers: { Authorization: Bearer ${token} },
      });
  
      // Update the folders state after deletion
      setFolders((prevFolders) => prevFolders.filter((folder) => folder.id !== id));
      alert('Folder deleted successfully!');
    } catch (err) {
      console.error('Failed to delete folder:', err);
  
      // Show appropriate error message
      if (err.response && err.response.status === 404) {
        alert('Folder not found or access denied');
      } else {
        alert('An unexpected error occurred. Please try again.');
      }
    }
  };
  
  

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
              <FolderCards
                key={folder.id}
                folderName={folder.name}
                folderId={folder.id}
                onRename={renameFolder}
                onDelete={deleteFolder}
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
                  <tr key={index}>
                    <td></td> {/* Placeholder for file icon */}
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
