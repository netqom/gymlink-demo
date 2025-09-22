import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import Filters from './components/Filters';
import BusinessCard from './components/BusinessCard';
import NaturalLanguageSearch from './components/NaturalLanguageSearch';
import OnboardingRecommendation from './components/OnboardingRecommendation';
import Chatbot from './components/Chatbot';
import './App.css';
import { ChevronDown, ChevronUp } from 'lucide-react'; 
function App() {
  const [businesses, setBusinesses] = useState([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    location: '',
    minPrice: '',
    maxPrice: '',
    vibe: '',
    service: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'table'
  const [filterOptions, setFilterOptions] = useState({});
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  const [showSearch, setShowSearch] = useState(true); 
  const [lastSearchQuery, setLastSearchQuery] = useState('');

  // Getting businesses and filter options
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [businessesResponse, filtersResponse] = await Promise.all([
          axios.get('/api/businesses'),
          axios.get('/api/businesses/search/filter')    
        ]);
        
        setBusinesses(businessesResponse.data.data);
        setFilteredBusinesses(businessesResponse.data.data);
        setFilterOptions(filtersResponse.data.data);
        setError(null);
      } catch (err) {
        setError('Failed to load fitness businesses. Please try again later.');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // filters and search
  useEffect(() => {
    let filtered = [...businesses];

    // search term
    if (searchTerm) {
      filtered = filtered.filter(business =>
        business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        business.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        business.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        business.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    //filters
    if (filters.category) {
      filtered = filtered.filter(business =>
        business.category.toLowerCase() === filters.category.toLowerCase()
      );
    }

    if (filters.location) {
      filtered = filtered.filter(business =>
        business.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.minPrice) {
      filtered = filtered.filter(business =>
        business.price >= parseInt(filters.minPrice)
      );
    }

    if (filters.maxPrice) {
      filtered = filtered.filter(business =>
        business.price <= parseInt(filters.maxPrice)
      );
    }

    if (filters.vibe) {
      filtered = filtered.filter(business =>
        business.vibe === filters.vibe
      );
    }

    if (filters.service) {
      filtered = filtered.filter(business =>
        business.services.some(service =>
          service.toLowerCase().includes(filters.service.toLowerCase())
        )
      );
    }

    setFilteredBusinesses(filtered);
  }, [businesses, searchTerm, filters]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      location: '',
      minPrice: '',
      maxPrice: '',
      vibe: '',
      service: ''
    });
    setSearchTerm('');
    setLastSearchQuery(''); 
  };

  const handleNaturalLanguageSearch = async (query) => {
    try {
      setLoading(true);
      setLastSearchQuery(query); // Store the search query
      const response = await axios.post('/api/businesses/search/natural', { query });
      
      // Extract filters from the natural language search response
      if (response.data.appliedFilters) {
        const appliedFilters = response.data.appliedFilters;
        const newFilters = { ...filters };
        console.log(appliedFilters,'appliedFiltersappliedFiltersappliedFilters');
        // Apply extracted filters to the current filter state
        if (appliedFilters.category) newFilters.category = appliedFilters.category;
        if (appliedFilters.location) newFilters.location = appliedFilters.location;
        if (appliedFilters.minPrice) newFilters.minPrice = appliedFilters.minPrice;
        if (appliedFilters.maxPrice) newFilters.maxPrice = appliedFilters.maxPrice;
        if (appliedFilters.vibe) newFilters.vibe = appliedFilters.vibe;
        if (appliedFilters.services && appliedFilters.services.length > 0) {
          newFilters.service = appliedFilters.services[0]; // Take first service
        }
    
        setFilters(newFilters); 
      }
      
      setFilteredBusinesses(response.data.data);
      setError(null);
    } catch (err) {
      setError('Failed to process natural language search. Please try again.');
      console.error('Error with natural language search:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOnboardingSelect = (business) => {
    // Filter to show only the selected business
    setFilteredBusinesses([business]);
    setShowOnboarding(false);
  };

  if (loading) {
    return (
      <div className="app">
        <Header />
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading fitness businesses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <Header 
        onShowOnboarding={() => setShowOnboarding(true)}
        onShowChatbot={() => setShowChatbot(true)}
      />
      
      <main className="main-content">
        <div className="search-section">
          <div className="search-header">
            <div className="search-title">
              <h3>Search & Discovery</h3>
              {lastSearchQuery && (
                <div className="last-search-display">
                  <span className="search-label">Last search:</span>
                  <span className="search-query">"{lastSearchQuery}"</span>
                </div>
              )}
            </div>
            <button 
              className="toggle-button"
              onClick={() => setShowSearch(!showSearch)}
            >
            {showSearch ? <ChevronUp className="toggle-icon" /> : <ChevronDown className="toggle-icon" />}
            
            </button>
          </div>
          {showSearch && (
            <div className="search-content">
              <SearchBar 
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                placeholder="Search for gyms, yoga studios, or locations..."
              />
              
              <NaturalLanguageSearch 
                onSearch={handleNaturalLanguageSearch}
                onCollapse={() => setShowSearch(false)}
              />
            </div>
          )}
        </div>

        <div className="filters-section">
          <Filters
            filters={filters}
            filterOptions={filterOptions}
            onFilterChange={handleFilterChange}
            onClearFilters={clearFilters}
            isExpanded={showFilters}
            onToggle={() => setShowFilters(!showFilters)}
          />
        </div>

        {error && (
          <div className="error-message">
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>
              Try Again
            </button>
          </div>
        )}

        <div className="results-section">
          <div className="results-header">
            <h2>
              {filteredBusinesses.length} fitness business{filteredBusinesses.length !== 1 ? 'es' : ''} found
            </h2>
            {/* <div className="view-toggle">
              <button
                className={viewMode === 'cards' ? 'active' : ''}
                onClick={() => setViewMode('cards')}
              >
                Cards
              </button>
              <button
                className={viewMode === 'table' ? 'active' : ''}
                onClick={() => setViewMode('table')}
              >
                Table
              </button>
            </div> */}
          </div>

          {filteredBusinesses.length === 0 ? (
            <div className="no-results">
              <p>No fitness businesses found matching your criteria.</p>
              <button onClick={clearFilters}>Clear all filters</button>
            </div>
          ) : (
            <div className={`businesses-grid ${viewMode}`}>
              {filteredBusinesses.map(business => (
                <BusinessCard
                  key={business.id}
                  business={business}
                  viewMode={viewMode}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Onboarding Recommendation Modal */}
      {showOnboarding && (
        <OnboardingRecommendation
          businesses={businesses}
          onSelectBusiness={handleOnboardingSelect}
          onClose={() => setShowOnboarding(false)}
        />
      )}

      {/* Chatbot Modal */}
      <Chatbot
        isOpen={showChatbot}
        onClose={() => setShowChatbot(false)}
      />
    </div>
  );
}

export default App;
