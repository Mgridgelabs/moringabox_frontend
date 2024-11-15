import React, { useState }  from 'react';
// import NavBar from '../components/NavBar';
import Header from '../components/Header';
import FileFolderContent from '../components/FileFolderContent';
import './FoldersPage.css';
import { Folder } from 'lucide-react';

const FoldersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Sample folders list
  const folders = [
    { id: 1, name: 'Project Documents' },
    { id: 2, name: 'Images' },
    { id: 3, name: 'Videos' },
    { id: 4, name: 'Music' },
    { id: 5, name: 'PDFs' },
    { id: 6, name: 'Spreadsheets' },
    { id: 7, name: 'Presentations' },
    { id: 8, name: 'Backup' },
    { id: 9, name: 'Personal' },
    { id: 10, name: 'Work' },
  ];

  // Filtered list of folders based on search term
  const filteredFolders = folders.filter(folder =>
    folder.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="folder-page-container">
      <div className="icon-and-title">
        <Folder className="icon"/>
        <h2>Folders</h2>
      </div>

      {/* Search Bar */}
      <div className="filters">
        <input
          type="text"
          placeholder="Search folders..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Display Folders using FileFolderContent Component */}
      <FileFolderContent items={filteredFolders} itemType="folder" />
    </div>
  );
};

export default FoldersPage;
