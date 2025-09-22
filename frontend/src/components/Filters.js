import React from 'react';
import { Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import './Filters.css';

const Filters = ({ filters, filterOptions, onFilterChange, onClearFilters, isExpanded, onToggle }) => {
  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  return (
    <div className="filters">
      <div className="filters-header">
        <div className="filters-title">
          <Filter className="filter-icon" />
          <h3>Filters</h3>
          <button 
            className="toggle-button"
            onClick={onToggle}
          >
            {isExpanded ? <ChevronUp className="toggle-icon" /> : <ChevronDown className="toggle-icon" />}
          </button>
        </div>
        {hasActiveFilters && (
          <button onClick={onClearFilters} className="clear-filters">
            <X className="clear-icon" />
            Clear All
          </button>
        )}
      </div>

      {isExpanded && (
        <div className="filters-grid">
        <div className="filter-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            value={filters.category}
            onChange={(e) => onFilterChange('category', e.target.value)}
            className="filter-select"
          >
            <option value="">All Categories</option>
            {filterOptions.categories?.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="location">Location</label>
          <select
            id="location"
            value={filters.location}
            onChange={(e) => onFilterChange('location', e.target.value)}
            className="filter-select"
          >
            <option value="">All Locations</option>
            {filterOptions.locations?.map(location => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="vibe">Vibe</label>
          <select
            id="vibe"
            value={filters.vibe}
            onChange={(e) => onFilterChange('vibe', e.target.value)}
            className="filter-select"
          >
            <option value="">All Vibes</option>
            {filterOptions.vibes?.map(vibe => (
              <option key={vibe} value={vibe}>
                {vibe}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="service">Service</label>
          <select
            id="service"
            value={filters.service}
            onChange={(e) => onFilterChange('service', e.target.value)}
            className="filter-select"
          >
            <option value="">All Services</option>
            {filterOptions.services?.map(service => (
              <option key={service} value={service}>
                {service}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group price-range">
          <label>Price Range (per week)</label>
          <div className="price-inputs">
            <input
              type="number"
              placeholder="Min"
              value={filters.minPrice}
              onChange={(e) => onFilterChange('minPrice', e.target.value)}
              className="price-input"
              min={filterOptions.priceRange?.min || 0}
              max={filterOptions.priceRange?.max || 100}
            />
            <span className="price-separator">to</span>
            <input
              type="number"
              placeholder="Max"
              value={filters.maxPrice}
              onChange={(e) => onFilterChange('maxPrice', e.target.value)}
              className="price-input"
              min={filterOptions.priceRange?.min || 0}
              max={filterOptions.priceRange?.max || 100}
            />
          </div>
        </div>
        </div>
      )}

      {hasActiveFilters && (
        <div className="active-filters">
          <span className="active-filters-label">Active filters:</span>
          <div className="active-filter-tags">
            {filters.category && (
              <span className="active-filter-tag">
                Category: {filters.category}
                <button onClick={() => onFilterChange('category', '')}>×</button>
              </span>
            )}
            {filters.location && (
              <span className="active-filter-tag">
                Location: {filters.location}
                <button onClick={() => onFilterChange('location', '')}>×</button>
              </span>
            )}
            {filters.vibe && (
              <span className="active-filter-tag">
                Vibe: {filters.vibe}
                <button onClick={() => onFilterChange('vibe', '')}>×</button>
              </span>
            )}
            {filters.service && (
              <span className="active-filter-tag">
                Service: {filters.service}
                <button onClick={() => onFilterChange('service', '')}>×</button>
              </span>
            )}
            {filters.minPrice && (
              <span className="active-filter-tag">
                Min Price: ${filters.minPrice}
                <button onClick={() => onFilterChange('minPrice', '')}>×</button>
              </span>
            )}
            {filters.maxPrice && (
              <span className="active-filter-tag">
                Max Price: ${filters.maxPrice}
                <button onClick={() => onFilterChange('maxPrice', '')}>×</button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Filters;
