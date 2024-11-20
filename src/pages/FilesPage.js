import React, { useState, useEffect } from "react";
import supabase from "../supabase"; // Import the Supabase client

const FilesPage = () => {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const fetchFiles = async () => {
    try {
      const { data, error } = await supabase
        .storage
        .from('bucket')  // Replace 'bucket' with your actual bucket name
        .list('files', {
          // Optional: You can specify directory, file filtering, etc.
          limit: 10,   // Limit the number of files if needed
          offset: 0,   // Offset for pagination
        });

      if (error) {
        setError(error.message);
      } else {
        // Assuming you need the metadata like file name, size, etc.
        setFiles(data);
        setError("");  // Clear any previous errors
      }
    } catch (err) {
      setError("Failed to fetch files.");
    }
  };

  useEffect(() => {
    if (token) {
      fetchFiles();
    } else {
      setError("User not logged in. Please log in to view files.");
    }
  }, [token]); // Dependency array: re-run on token change

  return (
    <div className="files-page">
      <h1>File Management</h1>
      {error && <p className="error">{error}</p>}
      {files.length > 0 ? (
        <table className="files-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Size (KB)</th>
              <th>Uploaded Date</th>
            </tr>
          </thead>
          <tbody>
            {files.map((file, index) => (
              <tr key={index}>
                <td>{file.name}</td> {/* File name */}
                <td>{(file.size / 1024).toFixed(2)} KB</td> {/* Size in KB */}
                <td>{new Date(file.created_at).toLocaleString()}</td> {/* Upload date */}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        !error && <p>No files available.</p>
      )}
    </div>
  );
};

export default FilesPage;
