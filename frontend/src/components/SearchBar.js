import React from 'react';
import { Search } from 'lucide-react';
import './SearchBar.css';

const SearchBar = ({ searchTerm, onSearchChange, placeholder }) => {
  return (
    <div className="search-bar">
      <div className="search-input-container">
        <Search className="search-icon" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder}
          className="search-input"
          prefix='Search for gyms, yoga studios, or locations...'
        />
      </div>
    </div>
  );
};

export default SearchBar;
