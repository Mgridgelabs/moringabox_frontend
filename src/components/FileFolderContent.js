
import React from 'react';
import './FileFolderContent.css';

const FileFolderContent = ({ type }) => {
  // Generate a list of items based on the type
  const items = Array.from({ length: 10 }, (_, i) => `${type} ${i + 1}`);

  return (
    <div className="content">
      {items.map((item, index) => (
        <div key={index} className="item">
          {item}
        </div>
      ))}
    </div>
  );
};

export default FileFolderContent;
