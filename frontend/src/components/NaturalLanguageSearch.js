import React, { useState } from 'react';
import { MessageCircle, Send } from 'lucide-react';
import './NaturalLanguageSearch.css';

const NaturalLanguageSearch = ({ onSearch, onCollapse }) => {
  const [query, setQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      // Collapse the search panel after searching
      if (onCollapse) {
        onCollapse();
      }
    }
  };

  const exampleQueries = [
    "cheap yoga in Melbourne",
    "cheap yoga in Perth", 
    "gym with sauna under $40", 
    "boxing classes in Brisbane",
    "pilates with personal training", 
  ];

  return (
    <div className="natural-search">
      <button
        className="toggle-button"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <MessageCircle className="icon" />
        <span>Try natural language search</span>
      </button>

      {isExpanded && (
        <div className="search-panel">
          <form onSubmit={handleSubmit} className="search-form">
            <div className="input-group">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g., 'cheap yoga near me with sauna'"
                className="search-input"
              />
              <button type="submit" className="submit-button">
                <Send className="send-icon" />
              </button>
            </div>
          </form>

          <div className="examples">
            <p className="examples-label">Try these examples:</p>
            <div className="example-tags">
              {exampleQueries.map((example, index) => (
                <button
                  key={index}
                  className="example-tag"
                  onClick={() => {
                    setQuery(example);
                    onSearch(example);
                    // Collapse the search panel after clicking example
                    if (onCollapse) {
                      onCollapse();
                    }
                  }}
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NaturalLanguageSearch;
