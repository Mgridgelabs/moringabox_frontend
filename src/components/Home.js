import React from 'react'
import FolderCards from './FolderCards'
import FileRows from './FileRows'
import './Home.css'

function Home() {
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
              <FileRows />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Home