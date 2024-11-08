import React, { useState, useEffect } from 'react';
import { Clock, File, FileText, Image, Video, Folder, Search, X } from 'lucide-react';
import './Recents.css';

const Recents = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [filteredItems, setFilteredItems] = useState({});

  // Sample data - replace this with your actual data fetching logic
  const mockData = {
    Today: [
      { id: 1, name: 'Project Report.pdf', type: 'document', size: '2.5 MB', lastModified: new Date() },
      { id: 2, name: 'Meeting Notes.docx', type: 'document', size: '1.2 MB', lastModified: new Date() },
      { id: 3, name: 'Screenshot.png', type: 'image', size: '4.7 MB', lastModified: new Date() }
    ],
    Yesterday: [
      { id: 4, name: 'Presentation.pptx', type: 'document', size: '5.8 MB', lastModified: new Date(Date.now() - 86400000) },
      { id: 5, name: 'Video Tutorial.mp4', type: 'video', size: '25.4 MB', lastModified: new Date(Date.now() - 86400000) }
    ],
    'Last Week': [
      { id: 6, name: 'Project Assets', type: 'folder', size: '168 MB', lastModified: new Date(Date.now() - 5 * 86400000) },
      { id: 7, name: 'Client Meeting.mp4', type: 'video', size: '85.2 MB', lastModified: new Date(Date.now() - 6 * 86400000) }
    ],
    'Last Month': [
      { id: 8, name: 'Archive', type: 'folder', size: '2.1 GB', lastModified: new Date(Date.now() - 25 * 86400000) }
    ]
  };

  const getIconForType = (type) => {
    switch (type) {
      case 'document':
        return <FileText className="item-icon document" />;
      case 'image':
        return <Image className="item-icon image" />;
      case 'video':
        return <Video className="item-icon video" />;
      case 'folder':
        return <Folder className="item-icon folder" />;
      default:
        return <File className="item-icon" />;
    }
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  };

  useEffect(() => {
    // Filter and search logic
    const filterItems = () => {
      const filtered = {};
      Object.entries(mockData).forEach(([timeFrame, items]) => {
        filtered[timeFrame] = items.filter(item => {
          const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
          const matchesType = selectedType === 'all' || item.type === selectedType;
          return matchesSearch && matchesType;
        });
      });
      setFilteredItems(filtered);
    };

    filterItems();
  }, [searchQuery, selectedType, mockData]); // Add mockData here

  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <div className="recent-container">
      <div className="recent-header">
        <div className="header-title">
          <Clock className="title-icon" />
          <h1>Recents</h1>
        </div>
        <div className="header-controls">
          <select 
            className="type-select"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="document">Documents</option>
            <option value="image">Images</option>
            <option value="video">Videos</option>
            <option value="folder">Folders</option>
          </select>
          <div className="search-container">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search files and folders"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            {searchQuery && (
              <button onClick={clearSearch} className="clear-search">
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="time-categories">
        {Object.entries(filteredItems).map(([timeFrame, items]) => (
          <div key={timeFrame} className="category-section">
            <h2 className="category-title">{timeFrame}</h2>
            <div className="category-content">
              {items.length === 0 ? (
                <div className="empty-state">
                  No items found for this period
                </div>
              ) : (
                <div className="items-grid">
                  {items.map((item) => (
                    <div key={item.id} className="item-card">
                      <div className="item-icon-wrapper">
                        {getIconForType(item.type)}
                      </div>
                      <div className="item-details">
                        <div className="item-name" title={item.name}>
                          {item.name}
                        </div>
                        <div className="item-meta">
                          <span className="item-size">{item.size}</span>
                          <span className="item-date">
                            {formatDate(item.lastModified)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recents;
