import React, { useState, useEffect } from 'react';
import { Star, Award, Target, Heart, Zap, Users, ArrowRight, CheckCircle, MapPin, DollarSign } from 'lucide-react';
import './OnboardingRecommendation.css';

const OnboardingRecommendation = ({ businesses, onSelectBusiness, onClose }) => {
  const [selectedGoals, setSelectedGoals] = useState([]);
  const [selectedBudget, setSelectedBudget] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [recommendation, setRecommendation] = useState(null);
  const [showRecommendation, setShowRecommendation] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const goals = [
    { id: 'weight-loss', label: 'Weight Loss', icon: Target, color: '#ef4444', description: 'Burn calories and lose weight' },
    { id: 'muscle-gain', label: 'Muscle Building', icon: Zap, color: '#f59e0b', description: 'Build strength and muscle mass' },
    { id: 'flexibility', label: 'Flexibility', icon: Heart, color: '#10b981', description: 'Improve mobility and flexibility' },
    { id: 'cardio', label: 'Cardio Fitness', icon: Heart, color: '#3b82f6', description: 'Boost heart health and endurance' },
    { id: 'stress-relief', label: 'Stress Relief', icon: Heart, color: '#8b5cf6', description: 'Relax and reduce stress' },
    { id: 'community', label: 'Community', icon: Users, color: '#06b6d4', description: 'Connect with like-minded people' }
  ];

  const budgetRanges = [
    { id: 'budget', label: 'Budget ($25-35/week)', min: 25, max: 35 },
    { id: 'mid', label: 'Mid-range ($35-45/week)', min: 35, max: 45 },
    { id: 'premium', label: 'Premium ($45+/week)', min: 45, max: 100 }
  ];

  const locations = ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Canberra', 'Gold Coast'];

  // Update progress based on current step and selections
  useEffect(() => {
    let newProgress = 0;
    if (selectedGoals.length > 0) newProgress += 33;
    if (selectedBudget) newProgress += 33;
    if (selectedLocation) newProgress += 34;
    setProgress(newProgress);
  }, [selectedGoals, selectedBudget, selectedLocation]);

  const handleGoalToggle = (goalId) => {
    setSelectedGoals(prev => 
      prev.includes(goalId) 
        ? prev.filter(id => id !== goalId)
        : [...prev, goalId]
    );
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return selectedGoals.length > 0;
      case 2: return selectedBudget;
      case 3: return selectedLocation;
      default: return false;
    }
  };

  const generateRecommendation = async () => {
    if (selectedGoals.length === 0 || !selectedBudget || !selectedLocation) {
      return;
    }

    setIsLoading(true);
    
    // Simulate API call delay for better UX
    await new Promise(resolve => setTimeout(resolve, 1500));

    const budgetRange = budgetRanges.find(b => b.id === selectedBudget);
    
    // Filter businesses by location and budget
    let filtered = businesses.filter(business => 
      business.location.toLowerCase().includes(selectedLocation.toLowerCase()) &&
      business.price >= budgetRange.min &&
      business.price <= budgetRange.max
    );

    // Score businesses based on selected goals
    const scoredBusinesses = filtered.map(business => {
      let score = 0;
      
      // Goal-based scoring
      selectedGoals.forEach(goal => {
        switch (goal) {
          case 'weight-loss':
            if (business.category === 'Gym' || business.services.some(s => s.includes('Cardio'))) score += 3;
            if (business.vibe === 'Performance & Intensity') score += 2;
            break;
          case 'muscle-gain':
            if (business.category === 'Gym' || business.services.some(s => s.includes('Personal Training'))) score += 3;
            if (business.vibe === 'Performance & Intensity') score += 2;
            break;
          case 'flexibility':
            if (business.category === 'Yoga' || business.category === 'Pilates') score += 3;
            if (business.vibe === 'Calm & Wellness') score += 2;
            break;
          case 'cardio':
            if (business.services.some(s => s.includes('Cardio') || s.includes('Group Classes'))) score += 2;
            if (business.category === 'Boxing') score += 3;
            break;
          case 'stress-relief':
            if (business.category === 'Yoga' || business.vibe === 'Calm & Wellness') score += 3;
            if (business.services.some(s => s.includes('Meditation'))) score += 2;
            break;
          case 'community':
            if (business.vibe === 'Community & Support') score += 3;
            if (business.services.some(s => s.includes('Group Classes'))) score += 2;
            break;
        }
      });

      // Add rating bonus
      score += business.rating * 0.5;

      return { ...business, score };
    });

    // Sort by score and get top recommendation
    const topRecommendation = scoredBusinesses
      .sort((a, b) => b.score - a.score)[0];

    setIsLoading(false);
    setRecommendation(topRecommendation);
    setShowRecommendation(true);
  };

  const handleSelectRecommendation = () => {
    onSelectBusiness(recommendation);
    onClose();
  };

  if (showRecommendation && recommendation) {
    return (
      <div className="recommendation-result">
       
        
        <div className="recommended-business">
        <div className="recommendation-header">
          <Award className="award-icon" />
          <h2>Perfect Match Found!</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
          <div className="business-card">
            <img src={recommendation.image} alt={recommendation.name} />
            <div className="business-info">
              <h3>{recommendation.name}</h3>
              <p className="location">{recommendation.location}</p>
              <p className="description">{recommendation.description}</p>
              
              <div className="business-details">
                <div className="detail">
                  <span className="label">Price:</span>
                  <span className="value">${recommendation.price}/week</span>
                </div>
                <div className="detail">
                  <span className="label">Rating:</span>
                  <div className="rating">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`star ${i < Math.floor(recommendation.rating) ? 'filled' : ''}`} 
                      />
                    ))}
                    <span>({recommendation.rating})</span>
                  </div>
                </div>
                <div className="detail">
                  <span className="label">Vibe:</span>
                  <span className="vibe-badge">{recommendation.vibe}</span>
                </div>
              </div>

              <div className="match-reasons">
                <h4>Why this is perfect for you:</h4>
                <ul>
                  {selectedGoals.map(goal => {
                    const goalData = goals.find(g => g.id === goal);
                    return (
                      <li key={goal}>
                        <goalData.icon className="goal-icon" style={{ color: goalData.color }} />
                        {goalData.label}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="recommendation-actions">
          <button className="secondary-btn" onClick={onClose}>
            See All Options
          </button>
          <button className="primary-btn" onClick={handleSelectRecommendation}>
            Select This Gym
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="onboarding-recommendation">
        <div className="loading-screen">
          <div className="loading-content">
            <div className="loading-spinner"></div>
            <h2>Finding Your Perfect Match...</h2>
            <p>Analyzing your preferences and matching you with the best fitness options</p>
            <div className="loading-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="onboarding-recommendation">
      <div className="onboarding-header">
        <div className="header-content">
          <Target className="target-icon" />
          <div className="header-text">
            <h2>Find Your Perfect Fitness Match</h2>
            <p>Tell us your goals and we'll recommend the best gym for you!</p>
          </div>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        {/* Progress Bar */}
        <div className="progress-container">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
          <div className="progress-steps">
            <div className={`step-indicator ${currentStep >= 1 ? 'active' : ''}`}>
              <div className="step-number">1</div>
              <span>Goals</span>
            </div>
            <div className={`step-indicator ${currentStep >= 2 ? 'active' : ''}`}>
              <div className="step-number">2</div>
              <span>Budget</span>
            </div>
            <div className={`step-indicator ${currentStep >= 3 ? 'active' : ''}`}>
              <div className="step-number">3</div>
              <span>Location</span>
            </div>
          </div>
        </div>
      </div>

      <div className="onboarding-content">
        {/* Step 1: Goals */}
        {currentStep === 1 && (
          <div className="step-content">
            <div className="step-header">
              <h3>What are your fitness goals?</h3>
              <p>Select all that apply to you</p>
            </div>
            <div className="goals-grid">
              {goals.map(goal => (
                <button
                  key={goal.id}
                  className={`goal-card ${selectedGoals.includes(goal.id) ? 'selected' : ''}`}
                  onClick={() => handleGoalToggle(goal.id)}
                >
                  <div className="goal-icon-container">
                    <goal.icon className="goal-icon" style={{ color: goal.color }} />
                    {selectedGoals.includes(goal.id) && <CheckCircle className="check-icon" />}
                  </div>
                  <div className="goal-text">
                    <span className="goal-label">{goal.label}</span>
                    <span className="goal-description">{goal.description}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Budget */}
        {currentStep === 2 && (
          <div className="step-content">
            <div className="step-header">
              <h3>What's your budget?</h3>
              <p>Choose your preferred weekly spending range</p>
            </div>
            <div className="budget-options">
              {budgetRanges.map(budget => (
                <button
                  key={budget.id}
                  className={`budget-card ${selectedBudget === budget.id ? 'selected' : ''}`}
                  onClick={() => setSelectedBudget(budget.id)}
                >
                  <DollarSign className="budget-icon" />
                  <div className="budget-text">
                    <span className="budget-label">{budget.label}</span>
                    <span className="budget-range">${budget.min} - ${budget.max === 100 ? '50+' : budget.max}/week</span>
                  </div>
                  {selectedBudget === budget.id && <CheckCircle className="check-icon" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Location */}
        {currentStep === 3 && (
          <div className="step-content">
            <div className="step-header">
              <h3>Where are you located?</h3>
              <p>Select your city or region</p>
            </div>
            <div className="location-options">
              {locations.map(location => (
                <button
                  key={location}
                  className={`location-card ${selectedLocation === location ? 'selected' : ''}`}
                  onClick={() => setSelectedLocation(location)}
                >
                  <MapPin className="location-icon" />
                  <span className="location-text">{location}</span>
                  {selectedLocation === location && <CheckCircle className="check-icon" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="step-navigation">
          {currentStep > 1 && (
            <button className="nav-btn secondary" onClick={prevStep}>
              Back
            </button>
          )}
          
          {currentStep < 3 ? (
            <button 
              className={`nav-btn primary ${!canProceed() ? 'disabled' : ''}`}
              onClick={nextStep}
              disabled={!canProceed()}
            >
              Next
              <ArrowRight className="nav-icon" />
            </button>
          ) : (
            <button 
              className={`nav-btn primary ${!canProceed() ? 'disabled' : ''}`}
              onClick={generateRecommendation}
              disabled={!canProceed()}
            >
              Get My Recommendation
              <Award className="nav-icon" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingRecommendation;
