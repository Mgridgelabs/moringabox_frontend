import React, { useState, useEffect } from "react";
import FileFolderContent from "../components/FileFolderContent";
import "./FoldersPage.css";
import { Folder } from "lucide-react";
import { apiFetch } from "../utils/api";

const FoldersPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const data = await apiFetch("https://cloudy-wiwu.onrender.com/api/recents/folders");
        setFolders(data.recent_folders);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFolders();
  }, []);

  const filteredFolders = folders.filter((folder) =>
    folder.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="folder-page-container">
      <div className="icon-and-title">
        <Folder className="icon" />
        <h2>Folders</h2>
      </div>

      <div className="filters">
        <input
          type="text"
          placeholder="Search folders..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

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
