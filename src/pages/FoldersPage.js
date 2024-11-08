import React from 'react';
// import NavBar from '../components/NavBar';
import Header from '../components/Header';
import FileFolderContent from '../components/FileFolderContent';
import './FoldersPage.css';

const FoldersPage = () => {
  return (
    <div className="page">
      <h1>Folders</h1>
      {/* <NavBar /> */}
      <div className="main">
        <Header title="My Folders" />
        <FileFolderContent type="Folder"/>
      </div>
    </div>
  );
};

export default FoldersPage;
