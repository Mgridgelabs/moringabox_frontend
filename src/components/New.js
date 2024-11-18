import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Image, 
  Video, 
  File, 
  FileText, 
  Music, 
  Link, 
  UploadCloud 
} from 'lucide-react';
import './New.css';

const New = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [recentFiles, setRecentFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadStatus, setUploadStatus] = useState({});

  // File selection handler
  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);
  };

  // Get icon based on file type
  const getFileIcon = (file) => {
    const type = file.type;
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
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('/api/upload/upload_file', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          
          // Update progress for this specific file
          setUploadProgress(prev => ({
            ...prev,
            [file.name]: percentCompleted
          }));

          // Update status
          setUploadStatus(prev => ({
            ...prev,
            [file.name]: percentCompleted === 100 ? 'Completed' : 'Uploading'
          }));
        }
      });

      // Add to recent files
      setRecentFiles(prev => [
        {
          name: file.name,
          type: file.type,
          size: file.size,
          uploadedAt: new Date(),
          serverResponse: response.data
        },
        ...prev
      ].slice(0, 5));  // Keep only the 5 most recent files

      // Mark as successful
      setUploadStatus(prev => ({
        ...prev,
        [file.name]: 'Success'
      }));

      return response.data;
    } catch (error) {
      console.error('Upload Error:', {
        fileName: file.name,
        errorMessage: error.message,
        errorResponse: error.response?.data
      });

      // Mark as failed
      setUploadStatus(prev => ({
        ...prev,
        [file.name]: 'Failed'
      }));

      throw error;
    }
  };

  // Bulk file upload
  const handleBulkUpload = async () => {
    if (selectedFiles.length === 0) {
      alert('Please select files to upload');
      return;
    }

    try {
      // Upload files sequentially
      for (const file of selectedFiles) {
        await uploadFile(file);
      }

      // Clear selected files after successful upload
      setSelectedFiles([]);
    } catch (error) {
      console.error('Bulk Upload Failed:', error);
    }
  };

  // Cancel upload for a specific file
  const cancelUpload = (fileName) => {
    // Implement cancellation logic if needed
    setUploadStatus(prev => ({
      ...prev,
      [fileName]: 'Cancelled'
    }));

    
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
          <input 
            type="file" 
            multiple 
            onChange={handleFileSelect}
            className="file-input"
          />
          <button 
            onClick={handleBulkUpload}
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
                      style={{width: `${uploadProgress[file.name]}%`}}
                    />
                    <span>{uploadProgress[file.name]}%</span>
                  </div>
                )}
                <span className={`upload-status ${uploadStatus[file.name]?.toLowerCase()}`}>
                  {uploadStatus[file.name] || 'Pending'}
                </span>
                <button 
                  onClick={() => cancelUpload(file.name)}
                  className="cancel-upload"
                >
                  Cancel
                </button>
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
      </div>
    </div>
  );
};

export default New;