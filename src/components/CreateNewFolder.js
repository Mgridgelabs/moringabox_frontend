import React, { useState } from "react";
import axios from "axios";
import "./CreateNewFolder.css";

const CreateFolder = () => {
  const [folderName, setFolderName] = useState("");
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false);

  const handleInputChange = (e) => {
    setFolderName(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token"); // JWT stored in localStorage

      // Make the API call to create a folder
      await axios.post(
        "https://cloudy-wiwu.onrender.com/api/folders/create",
        { name: folderName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Update the UI with a success message
      setMessage("Folder created successfully!");
      setFolderName(""); // Clear the input field
    } catch (error) {
      if (error.response) {
        console.error("Error response:", error.response.data); // Log error for debugging
        setMessage(`Error: ${error.response.data.error || "Something went wrong!"}`);
      } else {
        console.error("Unexpected error:", error); // Log unexpected errors
        setMessage("An unexpected error occurred");
      }
    }
  };

  const toggleFormVisibility = () => {
    setShowForm((prevShowForm) => !prevShowForm);
  };

  return (
    <div className="fcContainer">
      <button onClick={toggleFormVisibility} className="fcBtn">
        {showForm ? "Close" : "Create Folder"}
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
          <button type="submit" className="fcSubmit">Create</button>
        </form>
      )}
      {message && <p>{message}</p>}
    </div>
  );
};

export default CreateFolder;
