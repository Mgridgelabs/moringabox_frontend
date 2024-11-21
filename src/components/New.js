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

// Axios instance with interceptors
const axiosInstance = axios.create({
  baseURL: 'https://cloudy-wiwu.onrender.com/api',
  withCredentials: true,
});

// Token refresh logic in Axios interceptors
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post(
          '/auth/refresh-token',
          { token: refreshToken },
          { baseURL: 'https://cloudy-wiwu.onrender.com/api' }
        );

        // Save new token
        localStorage.setItem('token', response.data.accessToken);
        originalRequest.headers['Authorization'] = `Bearer ${response.data.accessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        window.location.href = '/login'; // Redirect to login on failure
      }
    }
    return Promise.reject(error);
  }
);

const New = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [recentFiles, setRecentFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadStatus, setUploadStatus] = useState({});

  // Check if a token is expired
  const isTokenExpired = (token) => {
    try {
      const [, payload] = token.split('.');
      const { exp } = JSON.parse(atob(payload));
      return Date.now() >= exp * 1000;
    } catch (error) {
      console.error('Error decoding token:', error);
      return true;
    }
  };

  // Refresh access token if expired
  const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      console.error('Refresh token not available. Redirecting to login.');
      window.location.href = '/login';
      return;
    }
    try {
      const response = await axios.post(
        '/auth/refresh-token',
        { token: refreshToken },
        { baseURL: 'https://cloudy-wiwu.onrender.com/api' }
      );
      localStorage.setItem('token', response.data.accessToken);
    } catch (error) {
      console.error('Failed to refresh token:', error);
      window.location.href = '/login';
    }
  };

  // Handle file selection
  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);
  };

  // Get file icon based on type
  const getFileIcon = (file) => {
    const type = file.type || '';
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
    const token = localStorage.getItem('token');

    // Check token validity
    if (!token || isTokenExpired(token)) {
      console.log('Refreshing token...');
      await refreshAccessToken();
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axiosInstance.post('/upload/upload_file', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        onUploadProgress: (progressEvent) => {
          const progress = (progressEvent.loaded / progressEvent.total) * 100;
          setUploadProgress((prevProgress) => ({
            ...prevProgress,
            [file.name]: progress,
          }));
        },
      });
      console.log('Upload Successful:', response.data);
      setRecentFiles((prevFiles) => [
        ...prevFiles,
        { ...file, uploadedAt: new Date() },
      ]);
      setUploadStatus((prevStatus) => ({
        ...prevStatus,
        [file.name]: 'Completed',
      }));
    } catch (error) {
      console.error('Upload Error:', error);
      setUploadStatus((prevStatus) => ({
        ...prevStatus,
        [file.name]: 'Failed',
      }));
    }
  };

  // Handle multiple file uploads
  const handleMultipleFileUpload = async () => {
    if (selectedFiles.length === 0) {
      alert('Please select files to upload');
      return;
    }

    selectedFiles.forEach((file) => {
      setUploadStatus((prevStatus) => ({
        ...prevStatus,
        [file.name]: 'Uploading...',
      }));
      uploadFile(file);
    });
  };

  return (
    <div className="upload-page">
      <div className="upload-container">
        <div className="upload-header">
          <h2>Upload Files</h2>
          <p>Select and upload multiple files</p>
        </div>

        {/* File Input */}
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

        <CreateFolder /> {/* Create Folder component */}
      </div>
    </div>
  );
};

export default New;
