
import React from 'react';
// import NavBar from '../components/NavBar';
import Header from '../components/Header';
import FileFolderContent from '../components/FileFolderContent';
import './FilesPage.css';


const FilesPage = () => {
  return (
    <div className="page">
      <h1>Files</h1>
      {/* <NavBar /> */}
      <div className="main">
        <Header />
        <FileFolderContent type="File" />
      </div>
    </div>
  );
};

export default FilesPage;
