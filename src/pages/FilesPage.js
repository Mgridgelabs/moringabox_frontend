import React, { useState } from 'react';
// import NavBar from '../components/NavBar';
import Header from '../components/Header';
import FileFolderContent from '../components/FileFolderContent';
import './FilesPage.css';
import { File } from 'lucide-react';


const FilesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [fileType, setFileType] = useState('All types');
  const files = [
    { name: 'Document 1', type: '.pdf' },
    { name: 'Spreadsheet 1', type: '.xlsx' },
    { name: 'Presentation 1', type: '.pptx' },
    { name: 'Image 1', type: '.jpg' },
    { name: 'Document 2', type: '.docx' },
    { name: 'Spreadsheet 2', type: '.xlsx' },
    { name: 'Presentation 2', type: '.pptx' },
    { name: 'Image 2', type: '.png' },
    { name: 'Document 3', type: '.pdf' },
    { name: 'Presentation 3', type: '.pptx' }
  ];

  const filteredFiles = files.filter(file => {
    const matchesType = fileType === 'All types' || file.type === fileType;
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="file-page-container">
      <div className="header">
        <div className="icon-and-title">
          {/* <img src="/path-to-icon/icon.png" alt="Files Icon" className="icon" /> */}
          <File className="icon file"/>
          <h2>Files</h2>
        </div>
        <div className="filters">
          <select value={fileType} onChange={(e) => setFileType(e.target.value)}>
            <option>All types</option>
            <option value=".pdf">PDF</option>
            <option value=".docx">DOCX</option>
            <option value=".xlsx">XLSX</option>
            <option value=".pptx">PPTX</option>
            <option value=".jpg">JPG</option>
            <option value=".png">PNG</option>
          </select>
          <input
            type="text"
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <FileFolderContent items={filteredFiles} type="file" />
    </div>
  );
};
export default FilesPage;