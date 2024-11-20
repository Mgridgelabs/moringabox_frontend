import React, { useState } from "react";
import axios from "axios";

const CreateFolder = () => {
  const [folderName, setFolderName] = useState("");
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false); // State to toggle form visibility

  const handleInputChange = (e) => {
    setFolderName(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token"); // JWT stored in localStorage
      const response = await axios.post(
        "https:cloudy-wiwu.onrender.com/api/folders/create",
        { name: folderName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setMessage(`Folder created successfully! ID: ${response.data.folder_id}`);
      setFolderName("");
    } catch (error) {
      if (error.response) {
        setMessage(`Error: ${error.response.data.error}`);
      } else {
        setMessage("An unexpected error occurred");
      }
    }
  };

  const toggleFormVisibility = () => {
    setShowForm((prevShowForm) => !prevShowForm);
  };

  return (
    <div>
      <button onClick={toggleFormVisibility}>
        {showForm ? "Hide Create Folder Form" : "Show Create Folder Form"}
      </button>
      {showForm && (
        <form onSubmit={handleSubmit}>
          <label>
            Folder Name:
            <input
              type="text"
              value={folderName}
              onChange={handleInputChange}
              required
            />
          </label>
          <button type="submit">Create</button>
        </form>
      )}
      {message && <p>{message}</p>}
    </div>
  );
};

export default CreateFolder;
