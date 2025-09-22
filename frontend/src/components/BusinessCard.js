import React from 'react';
import { MapPin, DollarSign, Star, Users, Clock } from 'lucide-react';
import './BusinessCard.css';

const BusinessCard = ({ business, viewMode }) => {
  const getVibeColor = (vibe) => {
    const colors = {
      'Performance & Intensity': '#ef4444',
      'Calm & Wellness': '#10b981',
      'Community & Support': '#3b82f6',
      'Modern & Tech-Forward': '#8b5cf6',
      'Flexibility & Lifestyle': '#f59e0b'
    };
    return colors[vibe] || '#64748b';
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="star filled" />);
    }

    if (hasHalfStar) {
      stars.push(<Star key="half" className="star half" />);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="star empty" />);
    }

    return stars;
  };

  if (viewMode === 'table') {
    return (
      <div className="business-table-row">
        <div className="table-cell name-cell">
          <div className="business-info">
            <img src={business.image} alt={business.name} className="business-image-small" />
            <div>
              <h3 className="business-name">{business.name}</h3>
              <span className="business-category">{business.category}</span>
            </div>
          </div>
        </div>
        
        <div className="table-cell location-cell">
          <MapPin className="icon" />
          <span>{business.location}</span>
        </div>
        
        <div className="table-cell price-cell">
          <DollarSign className="icon" />
          <span>${business.price}/week</span>
        </div>
        
        <div className="table-cell vibe-cell">
          <span 
            className="vibe-badge"
            style={{ backgroundColor: getVibeColor(business.vibe) }}
          >
            {business.vibe}
          </span>
        </div>
        
        <div className="table-cell rating-cell">
          <div className="rating">
            {renderStars(business.rating)}
            <span className="rating-text">{business.rating}</span>
          </div>
        </div>
        
        <div className="table-cell services-cell">
          <div className="services-list">
            {business.services.slice(0, 3).map((service, index) => (
              <span key={index} className="service-tag">
                {service}
              </span>
            ))}
            {business.services.length > 3 && (
              <span className="service-more">
                +{business.services.length - 3} more
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="business-card">
      <div className="card-header">
        <img src={business.image} alt={business.name} className="business-image" />
        <div className="card-overlay">
          <span 
            className="vibe-badge"
            style={{ backgroundColor: getVibeColor(business.vibe) }}
          >
            {business.vibe}
          </span>
        </div>
      </div>

      <div className="card-content">
        <div className="business-header">
          <h3 className="business-name">{business.name}</h3>
          <div className="rating">
            {renderStars(business.rating)}
            <span className="rating-text">{business.rating}</span>
          </div>
        </div>

        <p className="business-description">{business.description}</p>

        <div className="business-details">
          <div className="detail-item">
            <MapPin className="icon" />
            <span>{business.location}</span>
          </div>
          
          <div className="detail-item">
            <DollarSign className="icon" />
            <span>${business.price}/week</span>
          </div>
          
          <div className="detail-item">
            <Users className="icon" />
            <span>{business.category}</span>
          </div>
        </div>

        <div className="services-section">
          <h4 className="services-title">Services & Amenities</h4>
          <div className="services-grid">
            {business.services.map((service, index) => (
              <span key={index} className="service-tag">
                {service}
              </span>
            ))}
          </div>
        </div>
 
      </div>
    </div>
  );
};

export default BusinessCard;
