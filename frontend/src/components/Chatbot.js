import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Bot, User, HelpCircle } from 'lucide-react';
import './Chatbot.css';

const Chatbot = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: "Hi! I'm your fitness assistant. I can help you find information about gyms, yoga studios, and fitness businesses. What would you like to know?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState([]);
  const [capabilities, setCapabilities] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Fetch dynamic capabilities and suggested questions
  useEffect(() => {
    const fetchCapabilities = async () => {
      try {
        const response = await fetch('/api/chatbot/capabilities');
        const data = await response.json();
        if (data.success) {
          setCapabilities(data.data);
          setSuggestedQuestions(data.data.exampleQuestions || []);
        }
      } catch (error) {
        console.error('Error fetching chatbot capabilities:', error);
        // Fallback to default questions if API fails
        setSuggestedQuestions([
          "What gyms are in Sydney?",
          "Show me cheap yoga studios",
          "Which gyms have a sauna?",
          "What's the average price for gyms?",
          "Tell me about boxing classes"
        ]);
      }
    };

    if (isOpen) {
      fetchCapabilities();
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: inputValue.trim() }),
      });

      const data = await response.json();
      
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: data.answer,
        timestamp: new Date(),
        data: data.data, // Include the actual business data
        appliedFilters: data.appliedFilters,
        total: data.total
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: "Sorry, I'm having trouble connecting right now. Please try again later.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };


  const handleSuggestedQuestion = (question) => {
    setInputValue(question);
  };

  if (!isOpen) return null;

  return (
    <div className="chatbot-overlay">
      <div className="chatbot-container">
        <div className="chatbot-header">
          <div className="chatbot-title">
            <Bot className="bot-icon" />
            <div className="title-text">
              <h3>Fitness Assistant</h3>
              <span className="status">
                Online
                {capabilities && (
                  <span className="data-info">
                    • {capabilities.availableData?.totalBusinesses || 0} businesses
                  </span>
                )}
              </span>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X className="close-icon" />
          </button>
        </div>

        <div className="chatbot-messages">
          {messages.map((message) => (
            <div key={message.id} className={`message ${message.type}`}>
              <div className="message-avatar">
                {message.type === 'bot' ? <Bot className="avatar-icon" /> : <User className="avatar-icon" />}
              </div>
              <div className="message-content">
                <div className="message-bubble">
                  <p>{message.content}</p>
                  
                  {/* Display business results if available */}
                  {message.data && message.data.length > 0 && (
                    <div className="business-results">
                      <div className="results-header">
                        <span className="results-count">{message.total} result{message.total !== 1 ? 's' : ''} found</span>
                        {message.appliedFilters && Object.keys(message.appliedFilters).length > 0 && (
                          <div className="applied-filters">
                            {message.appliedFilters.category && (
                              <span className="filter-tag">Category: {message.appliedFilters.category}</span>
                            )}
                            {message.appliedFilters.location && (
                              <span className="filter-tag">Location: {message.appliedFilters.location}</span>
                            )}
                            {message.appliedFilters.maxPrice && (
                              <span className="filter-tag">Max Price: ${message.appliedFilters.maxPrice}</span>
                            )}
                            {message.appliedFilters.minPrice && (
                              <span className="filter-tag">Min Price: ${message.appliedFilters.minPrice}</span>
                            )}
                            {message.appliedFilters.services && message.appliedFilters.services.length > 0 && (
                              <span className="filter-tag">Services: {message.appliedFilters.services.join(', ')}</span>
                            )}
                          </div>
                        )}
                      </div>
                      
                      <div className="business-list">
                        {message.data.slice(0, 3).map((business) => (
                          <div key={business.id} className="business-item">
                            <div className="business-header">
                              <div className="business-title">
                                <h4>{business.name}</h4>
                                <span className="business-category">{business.category}</span>
                              </div>
                              <div className="business-price">${business.price}/week</div>
                            </div>
                            
                            <div className="business-details">
                              <div className="business-location">
                                📍 {business.location}
                              </div>
                              <div className="business-rating">
                                ⭐ {business.rating}/5
                              </div>
                            </div>
                            
                            <div className="business-description">
                              {business.description}
                            </div>
                            
                            <div className="business-services">
                              <span className="services-label">Services:</span>
                              <div className="services-list">
                                {business.services.slice(0, 4).map((service, index) => (
                                  <span key={index} className="service-item">• {service}</span>
                                ))}
                                {business.services.length > 4 && (
                                  <span className="service-item">• +{business.services.length - 4} more</span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {message.data.length > 3 && (
                        <div className="more-results">
                          <span>... and {message.data.length - 3} more results</span>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <span className="message-time">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="message bot">
              <div className="message-avatar">
                <Bot className="avatar-icon" />
              </div>
              <div className="message-content">
                <div className="message-bubble loading">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {messages.length === 1 && suggestedQuestions.length > 0 && (
          <div className="suggested-questions">
            <div className="suggestions-header">
              <HelpCircle className="help-icon" />
              <span>Try asking:</span>
            </div>
            <div className="suggestion-chips">
              {suggestedQuestions.map((question, index) => (
                <button
                  key={index}
                  className="suggestion-chip"
                  onClick={() => handleSuggestedQuestion(question)}
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="chatbot-input">
          <div className="input-container">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about fitness businesses..."
              disabled={isLoading}
              className="message-input"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="send-button"
            >
              <Send className="send-icon" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
