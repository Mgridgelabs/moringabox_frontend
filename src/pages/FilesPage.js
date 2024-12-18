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
        .createSignedUrl(`files/${fileName}`, 60); // Generate a signed URL valid for 60 seconds

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
      const targetPath = `folders/${targetFolder}/${fileName}`;
      const { data: copyData, error: copyError } = await supabase.storage
        .from("bucket")
        .copy(`files/${fileName}`, targetPath);

      if (copyError || !copyData) {
        alert("Failed to move the file.");
        console.error(copyError || "No data returned from copy");
        return;
      }

      const { error: deleteError } = await supabase.storage
        .from("bucket")
        .remove([`files/${fileName}`]);

      if (deleteError) {
        alert("Failed to delete the original file.");
        console.error(deleteError);
        return;
      }

      fetchFiles();
      alert(`File moved to ${targetFolder} successfully!`);
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
        .copy(`files/${renameFileName}`, `files/${newFileName}`);

      if (copyError || !copyData) {
        alert("Failed to rename the file.");
        console.error(copyError || "No data returned from copy");
        return;
      }

      const { error: deleteError } = await supabase.storage
        .from("bucket")
        .remove([`files/${renameFileName}`]);

      if (deleteError) {
        alert("Failed to delete the original file.");
        console.error(deleteError);
        return;
      }

      fetchFiles();
      alert(`File renamed to ${newFileName} successfully!`);
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
        .createSignedUrl(`files/${fileName}`, 60); // Generate a signed URL

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
        .remove([`files/${fileName}`]); // Delete the file from the storage bucket

      if (error) {
        alert("Failed to delete the file.");
        console.error(error);
        return;
      }

      fetchFiles();
      alert(`File ${fileName} deleted successfully!`);
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
