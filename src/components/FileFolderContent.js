import React from 'react';
//import './FileFolderContent.css';

const FileFolderContent = ({ items, itemType, onItemClick }) => {
  return (
    <div className="file-folder-content">
      {items.map((item) => (
        <div
          key={item.id}
          className={`item ${itemType} folder-list3`}
          onClick={() => onItemClick && onItemClick(item)} // Call onItemClick if provided
        >
          <p classname="folder-item3">{item.name}</p>
        </div>
      ))}
    </div>
  );
};

export default FileFolderContent;
