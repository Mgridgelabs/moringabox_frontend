import React, { useEffect, useState } from 'react';
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

  // Rename Folder
  const renameFolder = async (id, newName) => {
    try {
      const token = localStorage.getItem('token');
  
      // Send the request to the backend
      const response = await axios.put(
        `https://cloudy-wiwu.onrender.com/api/folders/update_name/${id}`,
        { new_name: newName }, // Use "new_name" as required by the API
        {
          headers: { Authorization: `Bearer ${token}` },
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
      await axios.delete(`https://cloudy-wiwu.onrender.com/api/folders/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
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
        className="more-vert-icon1"
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
        <div className="options-dropdown1" ref={dropdownRef}>
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
      <h1>Trashed Folders</h1>
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

import React, { useState, useEffect } from "react";
import supabase from "../supabase"; // Import the Supabase client
import './FilesPage.css'

const FilesPage = () => {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");
  const [renameFileName, setRenameFileName] = useState("");
  const [newFileName, setNewFileName] = useState("");
  const token = localStorage.getItem("token");

  const fetchFiles = async () => {
    try {
      const { data, error } = await supabase.storage
        .from("bucket") // Replace 'bucket' with your actual bucket name
        .list("files", {
          limit: 10,
          offset: 0,
        });

      if (error) {
        setError(error.message);
      } else {
        setFiles(data || []); // Ensure data is an array even if it's null
        setError("");
      }
    } catch (err) {
      setError("Failed to fetch files.");
    }
  };

  const handleFileDoubleClick = async (fileName) => {
    try {
      const { data, error } = await supabase.storage
        .from("bucket")
        .createSignedUrl(files/${fileName}, 60); // Generate a signed URL valid for 60 seconds

      if (error || !data) {
        alert("Failed to open the file.");
        console.error(error || "No data returned");
      } else {
        window.open(data.signedUrl, "_blank"); // Open the file in a new tab
      }
    } catch (err) {
      alert("An error occurred while opening the file.");
      console.error(err);
    }
  };

  const handleMoveFile = async (fileName, targetFolder) => {
    try {
      const targetPath = folders/${targetFolder}/${fileName};
      const { data: copyData, error: copyError } = await supabase.storage
        .from("bucket")
        .copy(files/${fileName}, targetPath);

      if (copyError || !copyData) {
        alert("Failed to move the file.");
        console.error(copyError || "No data returned from copy");
        return;
      }

      const { error: deleteError } = await supabase.storage
        .from("bucket")
        .remove([files/${fileName}]);

      if (deleteError) {
        alert("Failed to delete the original file.");
        console.error(deleteError);
        return;
      }

      fetchFiles();
      alert(File moved to ${targetFolder} successfully!);
    } catch (err) {
      alert("An error occurred while moving the file.");
      console.error(err);
    }
  };

  const handleRenameFile = async () => {
    if (!renameFileName || !newFileName) {
      alert("Please select a file and enter a new name.");
      return;
    }

    try {
      const { data: copyData, error: copyError } = await supabase.storage
        .from("bucket")
        .copy(files/${renameFileName}, files/${newFileName});

      if (copyError || !copyData) {
        alert("Failed to rename the file.");
        console.error(copyError || "No data returned from copy");
        return;
      }

      const { error: deleteError } = await supabase.storage
        .from("bucket")
        .remove([files/${renameFileName}]);

      if (deleteError) {
        alert("Failed to delete the original file.");
        console.error(deleteError);
        return;
      }

      fetchFiles();
      alert(File renamed to ${newFileName} successfully!);
      setRenameFileName("");
      setNewFileName("");
    } catch (err) {
      alert("An error occurred while renaming the file.");
      console.error(err);
    }
  };

  const handleDownloadFile = async (fileName) => {
    try {
      const { data, error } = await supabase.storage
        .from("bucket")
        .createSignedUrl(files/${fileName}, 60); // Generate a signed URL

      if (error || !data) {
        alert("Failed to download the file.");
        console.error(error || "No data returned");
        return;
      }

      const link = document.createElement("a");
      link.href = data.signedUrl;
      link.download = fileName; // Enforce downloading the file
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      alert("An error occurred while downloading the file.");
      console.error(err);
    }
  };

  const deleteFile = async (fileName) => {
    try {
      const { error } = await supabase.storage
        .from("bucket")
        .remove([files/${fileName}]); // Delete the file from the storage bucket

      if (error) {
        alert("Failed to delete the file.");
        console.error(error);
        return;
      }

      fetchFiles();
      alert(File ${fileName} deleted successfully!);
    } catch (err) {
      alert("An error occurred while deleting the file.");
      console.error(err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchFiles();
    } else {
      setError("User not logged in. Please log in to view files.");
    }
  }, [token]);

  return (
    <div className="files-page">
      <h1>File Management</h1>
      <p>Double-click a file to view it.</p>
      {error && <p className="error">{error}</p>}
      {files.length > 0 ? (
        <>
          <table className="files-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Size (KB)</th>
                <th>Uploaded Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {files.map((file, index) => (
                <tr
                  key={index}
                  onDoubleClick={() => handleFileDoubleClick(file.name)}
                  style={{ cursor: "pointer" }}
                >
                  <td>{file.name}</td>
                  <td>{file.size ? (file.size / 1024).toFixed(2) : "N/A"} KB</td>
                  <td>
                    {file.created_at
                      ? new Date(file.created_at).toLocaleString()
                      : "N/A"}
                  </td>
                  <td>
                    <button
                      id="moveBtn"
                      onClick={() =>
                        handleMoveFile(file.name, "target-subfolder") // Replace with the folder name
                      }
                    >
                      Move to Folder
                    </button>
                    <button id="downloadBtn" onClick={() => handleDownloadFile(file.name)}>
                      Download
                    </button>
                    <button id="renameBtn" onClick={() => setRenameFileName(file.name)}>
                      Rename
                    </button>
                    <button id="deleteBtn" onClick={() => deleteFile(file.name)}>Delete</button> {/* Delete Button */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {renameFileName && (
            <div className="rename-modal">
              <h2>Rename File</h2>
              <p>Current Name: {renameFileName}</p>
              <input
                type="text"
                placeholder="Enter new file name"
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
              />
              <button onClick={handleRenameFile}>Rename</button>
              <button onClick={() => setRenameFileName("")}>Cancel</button>
            </div>
          )}
        </>
      ) : (
        !error && <p>No files available.</p>
      )}
    </div>
  );
};

export default FilesPage;
