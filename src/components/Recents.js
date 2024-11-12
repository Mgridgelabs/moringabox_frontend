import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Clock, File, FileText, Image, Video, Folder, Search, X } from 'lucide-react';
import './Recents.css';

const Recents = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [filteredItems, setFilteredItems] = useState({});
  const [items, setItems] = useState({});

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
    }).format(new Date(date));
  };

  useEffect(() => {
    // Fetch data from the backend API using Axios
    const fetchItems = async () => {
      try {
        const response = await axios.get('/api/recents'); // Replace with your backend endpoint
        setItems(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchItems();
  }, []);

  useEffect(() => {
    // Filter and search logic
    const filterItems = () => {
      const filtered = {};
      Object.entries(items).forEach(([timeFrame, itemsArray]) => {
        filtered[timeFrame] = itemsArray.filter(item => {
          const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
          const matchesType = selectedType === 'all' || item.type === selectedType;
          return matchesSearch && matchesType;
        });
      });
      setFilteredItems(filtered);
    };

    filterItems();
  }, [searchQuery, selectedType, items]);

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
        {Object.entries(filteredItems).map(([timeFrame, itemsArray]) => (
          <div key={timeFrame} className="category-section">
            <h2 className="category-title">{timeFrame}</h2>
            <div className="category-content">
              {itemsArray.length === 0 ? (
                <div className="empty-state">
                  No items found for this period
                </div>
              ) : (
                <div className="items-grid">
                  {itemsArray.map((item) => (
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
