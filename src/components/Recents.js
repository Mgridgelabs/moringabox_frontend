import React, { useState, useEffect } from "react";
import axios from "axios";
import { Clock, File, FileText, Image, Video, Folder, Search, X } from "lucide-react";
import "./Recents.css"; // Make sure to have appropriate styles

const Recents = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [recentFiles, setRecentFiles] = useState([]);
  const [recentFolders, setRecentFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedFolder, setSelectedFolder] = useState(null); // Track selected folder
  const [files, setFiles] = useState([]); // Track files in selected folder
  const [filesLoading, setFilesLoading] = useState(false);

  useEffect(() => {
    const fetchRecentItems = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("User  is not authenticated");
          setLoading(false);
          return;
        }

        const filesResponse = await axios.get("https://cloudy-wiwu.onrender.com/api/recents/files", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const foldersResponse = await axios.get("https://cloudy-wiwu.onrender.com/api/recents/folders", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        setRecentFiles(filesResponse.data.recent_files);
        setRecentFolders(foldersResponse.data.recent_folders);
      } catch (err) {
        setError(err.response?.data?.msg || "Failed to fetch recent items");
      } finally {
        setLoading(false);
      }
    };

    fetchRecentItems();
  }, []);

  const handleFolderClick = async (folder) => {
    setSelectedFolder(folder);
    setFilesLoading(true);
    setFiles([]);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`https://cloudy-wiwu.onrender.com/api/files/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setFiles(response.data.files);
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to fetch files");
    } finally {
      setFilesLoading(false);
    }
  };

  // Filtered list of files and folders based on search term
  const filteredFiles = recentFiles.filter((file) =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFolders = recentFolders.filter((folder) =>
    folder.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const clearSearch = () => {
    setSearchQuery("");
  };

  return (
    <div className="recent-container">
      <div className="recent-header">
        <div className="header-title">
          <Clock className="title-icon" />
          <h1>Recents</h1>
        </div>
        <div className="header-controls">
          <div className="search-container">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search files and folders"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            {searchQuery && (
              <button onClick={clearSearch} className="clear-search">
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Display loading, error, or recent items */}
      {loading ? (
        <p>Loading recent items...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : selectedFolder ? (
        <div>
          <h3>Files in {selectedFolder.name}</h3>
          {filesLoading ? (
            <p>Loading files...</p>
          ) : files.length > 0 ? (
            <ul className="folder-list">
              {files.map((file) => (
                <li key={file.id} className="folder-item">
                  {file.name}
                </li>
              ))}
            </ul>
          ) : (
            <p>No files found in this folder.</p>
          )}
        </div>
      ) : (
        <div>
          <h2>Recent Files</h2>
          <div className="items-grid">
            {filteredFiles.length === 0 ? (
              <p>No recent files found.</p>
            ) : (
              filteredFiles.map((file) => (
                <div key={file.id} className="item-card">
                  <div className="item-icon-wrapper">
                    {getIconForType(file.type)}
                  </div>
                  <div className="item-details">
                    <div className="item-name" title={file.name}>
                      {file.name}
                    </div>
                    <div className="item-meta">
                      <span className="item-size">{file.size}</span>
                      <span className="item-date">
                        {formatDate(file.lastModified)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <h2>Recent Folders</h2>
          <div className="items-grid">
            {filteredFolders.length === 0 ? (
              <p>No recent folders found.</p>
            ) : (
              filteredFolders.map((folder) => (
                <div key={folder.id} className="item-card" onClick={() => handleFolderClick(folder)}>
                  <div className="item-icon-wrapper">
                    {getIconForType(folder.type)}
                  </div>
                  <div className="item-details">
                    <div className="item-name" title={folder.name}>
                      {folder.name}
                    </div>
                    <div className="item-meta">
                      <span className="item-size">{folder.size}</span>
                      <span className="item-date">
                        {formatDate(folder.lastModified)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const getIconForType = (type) => {
  switch (type) {
    case 'document':
      return <FileText className="item-icon document" />;
    case 'image':
      return <Image className="item-icon image" />;
    case 'video':
      return <Video className="item-icon video" />;
    case 'folder':
      return <Folder className="item-icon folder" />;
    default:
      return <File className="item-icon" />;
  }
};

const formatDate = (date) => {
  const parsedDate = new Date(date);
  if (isNaN(parsedDate)) {
    return "Invalid date"; // or return a default value
  }
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  }).format(parsedDate);
};

export default Recents;