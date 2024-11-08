
import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <div className="header-controls">
      <select>
        <option>Type</option>
        <option>Documents</option>
        <option>Images</option>
        <option>Videos</option>
      </select>
      <input type="text" placeholder="search" />
    </div>
  );
};

export default Header;
