import React, { useState } from 'react';
import { Image, Video, Music, Link, File } from 'lucide-react';
import '@uppy/core/dist/style.css';
import '@uppy/dashboard/dist/style.css';
import { Uppy } from '@uppy/core';
import { Dashboard } from '@uppy/react';
import GoogleDrive from '@uppy/google-drive';
import Instagram from '@uppy/instagram';
import Facebook from '@uppy/facebook';
import Dropbox from '@uppy/dropbox';
import OneDrive from '@uppy/onedrive';
import Box from '@uppy/box';
import Url from '@uppy/url';
import Zoom from '@uppy/zoom';
import Unsplash from '@uppy/unsplash';
import WebCamera from '@uppy/webcam';
import ScreenCapture from '@uppy/screen-capture';
import Tus from '@uppy/tus';
import './New.css';

const New = () => {
  const [recentFiles, setRecentFiles] = useState([]);
  
  // Initialize Uppy
  const uppy = new Uppy({
    restrictions: {
      maxFileSize: 100000000, // 100MB
      maxNumberOfFiles: 20,
      allowedFileTypes: null
    },
    autoProceed: false,
  })
  .use(GoogleDrive, {
    companionUrl: 'https://companion.uppy.io'
  })
  .use(Instagram, {
    companionUrl: 'https://companion.uppy.io'
  })
  .use(Facebook, {
    companionUrl: 'https://companion.uppy.io'
  })
  .use(Dropbox, {
    companionUrl: 'https://companion.uppy.io'
  })
  .use(OneDrive, {
    companionUrl: 'https://companion.uppy.io'
  })
  .use(Box, {
    companionUrl: 'https://companion.uppy.io'
  })
  .use(Url, {
    companionUrl: 'https://companion.uppy.io'
  })
  .use(Zoom, {
    companionUrl: 'https://companion.uppy.io'
  })
  .use(Unsplash, {
    companionUrl: 'https://companion.uppy.io'
  })
  .use(WebCamera, {
    mirror: true,
    showRecordingLength: true
  })
  .use(ScreenCapture, {
    displayMediaConstraints: {
      video: {
        width: 1280,
        height: 720
      }
    }
  })
  .use(Tus, {
    endpoint: '/api/upload',
    resume: true,
    retryDelays: [0, 1000, 3000, 5000]
  });

  // Handle successful uploads
  uppy.on('upload-success', (file, response) => {
    setRecentFiles(prev => [{
      id: file.id,
      name: file.name,
      type: file.type,
      size: file.size,
      date: new Date(),
      source: file.source
    }, ...prev].slice(0, 5));
  });

  const getFileIcon = (type) => {
    if (type.startsWith('image/')) return <Image className="file-type-icon image" size={24} />;
    if (type.startsWith('video/')) return <Video className="file-type-icon video" size={24} />;
    if (type.startsWith('audio/')) return <Music className="file-type-icon audio" size={24} />;
    if (type.startsWith('url/')) return <Link className="file-type-icon link" size={24} />;
    return <File className="file-type-icon default" size={24} />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getSourceLabel = (source) => {
    const sources = {
      'GoogleDrive': 'Google Drive',
      'Instagram': 'Instagram',
      'Facebook': 'Facebook',
      'Dropbox': 'Dropbox',
      'OneDrive': 'OneDrive',
      'Box': 'Box',
      'Url': 'URL',
      'Zoom': 'Zoom',
      'Unsplash': 'Unsplash',
      'WebCamera': 'Camera',
      'ScreenCapture': 'Screen',
      'Local': 'Local Device'
    };
    return sources[source] || source;
  };

  return (
    <div className="upload-page">
      <div className="upload-container">
        <div className="upload-header">
          <h2>Upload Files</h2>
          <p>Choose files from multiple sources</p>
        </div>

        <div className="uppy-dashboard-container">
          <Dashboard
            uppy={uppy}
            plugins={[
              'GoogleDrive',
              'Instagram',
              'Facebook',
              'Dropbox',
              'OneDrive',
              'Box',
              'Url',
              'Zoom',
              'Unsplash',
              'WebCamera',
              'ScreenCapture'
            ]}
            theme="light"
            proudlyDisplayPoweredByUppy={false}
            showSelectedFiles={true}
            height={450}
            width="100%"
            note="Up to 20 files, 100MB each"
          />
        </div>

        {recentFiles.length > 0 && (
          <div className="recent-uploads">
            <h3>Recent Uploads</h3>
            <div className="recent-files-list">
              {recentFiles.map(file => (
                <div key={file.id} className="file-item">
                  <div className="file-icon">
                    {getFileIcon(file.type)}
                  </div>
                  <div className="file-details">
                    <div className="file-name-row">
                      <span className="file-name">{file.name}</span>
                      <span className="file-source">{getSourceLabel(file.source)}</span>
                    </div>
                    <div className="file-info-row">
                      <span className="file-size">{formatFileSize(file.size)}</span>
                      <span className="file-date">
                        {new Date(file.date).toLocaleDateString()} 
                        {new Date(file.date).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default New;