import React, {useEffect, useState } from 'react'
import FolderCards from './FolderCards'
import FileRows from './FileRows'
import './Home.css'
import axios from 'axios'

function Home() {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://cloudy-wiwu.onrender.com/api/recents/files', {
          headers: {Authorization : `Bearer ${token}`},
        });
        setFiles(response.data.recent_files);
      } catch (err) {
        console.error(err);
        setError('Failes to fetch files');
      }
    };
    fetchFiles();
  }, []);
  return (
    <div className="home-Content">
      <h1 id="home-Title">Welcome To Drive</h1>
      <div className="searchDiv">
        <h2 id="search-title">Search</h2>
        <input name="search field" placeholder="search text"/>
      </div>
      <div className="foldersDiv">
        <h1 id="folders-title">Folders</h1>
        <div className="folder-cards">
          <FolderCards />
        </div>
      </div>
      <div className="filesDiv">
        <h1 id="files-title">Files</h1>
        <div className="files-container">
          <table className="files-table">
            <thead>
              <tr>
                <th className="file-icon"></th>
                <th className="file-name">Name</th>
                <th className="file-location">Location</th>
                <th className="file-options"></th>
              </tr>
            </thead>
            <tbody>
              {files.length > 0 ? (
                files.map((file) => <FileRows key={file.id} file={file} />)
              ) : (
                <tr>
                  <td colSpan="4">No Files Uploaded</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Home