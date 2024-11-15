
import React from 'react';
import './FileFolderContent.css';

const FileFolderContent = ({ items, type }) => {
  return (
    <div className="file-folder-content">
      {items.length > 0 ? (
        items.map((item, index) => (
          <div key={index} className="file-folder-item">
            {type === 'file' ? `${item.name}${item.type}` : item.name}
          </div>
        ))
      ) : (
        <p className="no-item-message">No {type === 'file' ? 'files' : 'folders'} found.</p>
      )}
    </div>
  );
};

export default FileFolderContent;
