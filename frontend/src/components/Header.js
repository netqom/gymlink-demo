import React from 'react';
import { Dumbbell, MapPin, Target, MessageCircle } from 'lucide-react';
import './Header.css';

const Header = ({ onShowOnboarding, onShowChatbot }) => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <Dumbbell className="logo-icon" />
          <h1>GymLink</h1>
        </div>
        <div className="header-actions">
          <button 
            className="chatbot-button"
            onClick={onShowChatbot}
          >
            <MessageCircle className="icon" />
            <span>Ask Assistant</span>
          </button>
          <button 
            className="onboarding-button"
            onClick={onShowOnboarding}
          >
            <Target className="icon" />
            <span>Get Recommendation</span>
          </button>
          <div className="tagline">
            <MapPin className="tagline-icon" />
            <span>Australia's First Fitness Comparison Platform</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
