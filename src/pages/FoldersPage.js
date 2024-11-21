import React, { useState, useEffect } from "react";
import FileFolderContent from "../components/FileFolderContent";
import "./FoldersPage.css";
import { Folder } from "lucide-react";
import back2 from "../assets/back_img.png"
import axios from "axios";

const FoldersPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedFolder, setSelectedFolder] = useState(null); // Track selected folder
  const [files, setFiles] = useState([]); // Track files in selected folder
  const [filesLoading, setFilesLoading] = useState(false);

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const token = localStorage.getItem("token"); // Token is stored in localStorage
        if (!token) {
          setError("User is not authenticated");
          setLoading(false);
          return;
        }

        const response = await axios.get("https://cloudy-wiwu.onrender.com/api/recents/folders", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        setFolders(response.data.recent_folders);
      } catch (err) {
        setError(err.response?.data?.msg || "Failed to fetch folders");
      } finally {
        setLoading(false);
      }
    };

    fetchFolders();
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

  // Filtered list of folders based on search term
  const filteredFolders = folders.filter((folder) =>
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
      ) : selectedFolder ? (
        <div>
          <img src={back2} alt="back" onClick={() => setSelectedFolder(null)} className="backbtn" />
          <h3>Files in {selectedFolder.name}</h3>
          {filesLoading ? (
            <p>Loading files...</p>
          ) : files.length > 0 ? (
            <ul className="folder-list3">
              {files.map((file) => (
                <li key={file.id} className="folder-item3">{file.name} </li>
              ))}
            </ul>
          ) : (
            <p>No files found in this folder.</p>
          )}
        </div>
      ) : (
        <FileFolderContent items={filteredFolders} itemType="folder" onItemClick={handleFolderClick} />
      )}
    </div>
  );
};

export default FoldersPage;
