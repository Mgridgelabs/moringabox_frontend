import React from 'react';
import './Storage.css';

const StorageIndicator = () => {
  const getProgressColor = () => {
    const usagePercentage = 70;  // You can change this value dynamically based on actual data

    if (usagePercentage > 85) {
      return 'red';
    } else if (usagePercentage > 50) {
      return 'yellow';
    }
    return 'green';
  };

  return (
    <div className="storage-container">
      <div className="storage-header">
        <span className="storage-title">STORAGE</span>
      </div>

      <div className="progress-bar-container">
        <div 
          className={`progress-bar ${getProgressColor()}`}
          style={{ width: '70%' }} 
        />
      </div>
    </div>
  );
};

export default StorageIndicator;
