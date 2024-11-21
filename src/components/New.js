import React, { useState } from 'react';
import axios from 'axios';
import './New.css';
import { 
  Image, 
  Video, 
  File, 
  FileText, 
  Music, 
  UploadCloud 
} from 'lucide-react';
import CreateFolder from './CreateNewFolder';

const New = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [recentFiles, setRecentFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadStatus, setUploadStatus] = useState({});

  // Axios interceptor for debugging
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      console.error('Axios Error:', error.response || error.message);
      return Promise.reject(error);
    }
  );

  // File selection handler
  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);
  };

  // Get icon based on file type
  const getFileIcon = (file) => {
    const type = file.type || ''; // Ensure type is a string
    if (type.startsWith('image/')) return <Image className="file-type-icon image" />;
    if (type.startsWith('video/')) return <Video className="file-type-icon video" />;
    if (type.startsWith('audio/')) return <Music className="file-type-icon audio" />;
    if (type.startsWith('application/pdf')) return <FileText className="file-type-icon document" />;
    return <File className="file-type-icon default" />;
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Upload individual file
  const uploadFile = async (file) => {
    const token = localStorage.getItem('token'); // Fetch the token from localStorage
  
    const formData = new FormData();
    formData.append('file', file);
  
    try {
      const response = await axios.post(
        'https://cloudy-wiwu.onrender.com/api/upload/upload_file',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`, // Include the JWT token
          },
          withCredentials: true, // Required if the backend uses cookies for authentication
          onUploadProgress: (progressEvent) => {
            const progress = (progressEvent.loaded / progressEvent.total) * 100;
            setUploadProgress((prevProgress) => ({
              ...prevProgress,
              [file.name]: progress,
            }));
          }
        }
      );
      console.log('Upload Successful:', response.data);
      // Save recent files
      setRecentFiles((prevFiles) => [
        ...prevFiles,
        { ...file, uploadedAt: new Date() },
      ]);
      setUploadStatus((prevStatus) => ({
        ...prevStatus,
        [file.name]: 'Completed',
      }));
    } catch (error) {
      console.error('Upload Error:', {
        fileName: file.name,
        errorMessage: error.message,
        errorResponse: error.response?.data,
      });
      setUploadStatus((prevStatus) => ({
        ...prevStatus,
        [file.name]: 'Failed',
      }));
    }
  };

  const handleMultipleFileUpload = async () => {
    if (selectedFiles.length === 0) {
      alert('Please select files to upload');
      return;
    }
  
    // Iterate over selected files and upload each one
    try {
      selectedFiles.forEach((file) => {
        setUploadStatus((prevStatus) => ({
          ...prevStatus,
          [file.name]: 'Uploading...',
        }));
        uploadFile(file);
      });
    } catch (error) {
      console.error('Multiple File Upload Failed:', error);
    }
  };

  return (
    <div className="upload-page">
      <div className="upload-container">
        <div className="upload-header">
          <h2>Upload Files</h2>
          <p>Select and upload multiple files</p>
        </div>

        {/* Updated File Input */}
        <div className="file-input-container">
          <label htmlFor="fileInput" className="file-input-label">
            Choose Files
          </label>
          <input 
            id="fileInput"
            type="file" 
            multiple 
            onChange={handleFileSelect}
            className="file-input" 
          />
          <button 
            onClick={handleMultipleFileUpload}
            disabled={selectedFiles.length === 0}
            className="upload-button"
          >
            <UploadCloud /> Upload Files
          </button>
        </div>

        {/* Selected Files Preview */}
        {selectedFiles.length > 0 && (
          <div className="selected-files-preview">
            <h3>Selected Files</h3>
            {selectedFiles.map((file, index) => (
              <div key={index} className="selected-file-item">
                {getFileIcon(file)}
                <div className="file-details">
                  <span>{file.name}</span>
                  <span>{formatFileSize(file.size)}</span>
                </div>
                {uploadProgress[file.name] && (
                  <div className="upload-progress">
                    <div 
                      className="progress-bar" 
                      style={{ width: `${uploadProgress[file.name]}%` }}
                    />
                    <span>{uploadProgress[file.name].toFixed(2)}%</span>
                  </div>
                )}
                <span className={`upload-status ${uploadStatus[file.name]?.toLowerCase()}`}>
                  {uploadStatus[file.name] || 'Pending'}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Recent Uploads */}
        {recentFiles.length > 0 && (
          <div className="recent-uploads">
            <h3>Recent Uploads</h3>
            {recentFiles.map((file, index) => (
              <div key={index} className="recent-file-item">
                {getFileIcon(file)}
                <div className="file-details">
                  <span>{file.name}</span>
                  <span>{formatFileSize(file.size)}</span>
                  <span>{file.uploadedAt.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
          <CreateFolder /> {/* Keep the Create Folder component */}
      </div>
    </div>
  );
};

export default New;
