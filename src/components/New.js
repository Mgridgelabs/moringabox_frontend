import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { Upload, FolderPlus, Image, Video, Music, FileText } from 'lucide-react';
import './New.css';

const New = () => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [recentFiles, setRecentFiles] = useState([]);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const uploadFile = (file) => {
    setUploading(true);
    setUploadProgress(0);

    // Create a FormData object to send the file
    const formData = new FormData();
    formData.append('file', file);

    // Send the file to the backend using Axios
    axios.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadProgress(percentCompleted);
      }
    })
    .then((response) => {
      setUploading(false);
      setUploadProgress(100);
      
      // Add uploaded file to recent files
      setRecentFiles(prev => [{
        id: response.data.id, // Assuming the backend returns the file ID
        name: file.name,
        type: file.type,
        size: file.size,
        date: new Date()
      }, ...prev].slice(0, 5));
    })
    .catch((error) => {
      console.error('Error uploading file:', error);
      setUploading(false);
    });
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      uploadFile(files[0]);
    }
  }, []);

  const handleFileInput = useCallback((e) => {
    const files = e.target.files;
    Array.from(files).forEach(file => uploadFile(file));
  }, []);

  const getFileIcon = (type) => {
    if (type.startsWith('image/')) return <Image className="text-blue-500" size={20} />;
    if (type.startsWith('video/')) return <Video className="text-purple-500" size={20} />;
    if (type.startsWith('audio/')) return <Music className="text-green-500" size={20} />;
    return <FileText className="text-gray-500" size={20} />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="moringa-container">
      {/* Main Content */}
      <div className="main-content">
        <div className="upload-container">
          <div 
            className={`drop-zone ${dragActive ? 'active' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="drop-zone-content">
              <Upload className="upload-icon" />
              <h3 className="drop-zone-title">Drag & Drop your files</h3>
              <p className="drop-zone-subtitle">or</p>
              
              <div className="upload-buttons">
                <input
                  type="file"
                  id="fileInput"
                  className="file-input"
                  onChange={handleFileInput}
                  multiple
                />
                <button
                  onClick={() => document.getElementById('fileInput').click()}
                  className="upload-button"
                >
                  File upload
                </button>
                <button
                  onClick={() => document.getElementById('fileInput').click()}
                  className="upload-button folder-button"
                >
                  <FolderPlus size={16} className="mr-2" />
                  Folder upload
                </button>
              </div>

              {uploading && (
                <div className="upload-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <span className="progress-text">{uploadProgress}% uploaded</span>
                </div>
              )}
            </div>
          </div>

          {recentFiles.length > 0 && (
            <div className="recent-uploads">
              <h4 className="recent-title">Recent Uploads</h4>
              <div className="recent-files">
                {recentFiles.map(file => (
                  <div key={file.id} className="file-item">
                    <div className="file-icon">
                      {getFileIcon(file.type)}
                    </div>
                    <div className="file-info">
                      <span className="file-name">{file.name}</span>
                      <span className="file-size">{formatFileSize(file.size)}</span>
                    </div>
                    <span className="file-date">
                      {new Date(file.date).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default New;
