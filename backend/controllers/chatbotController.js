const chatbotService = require('../services/chatbotService');
const path = require('path');
const fs = require('fs');

class ChatbotController {
  constructor() {
    this.chatbotService = chatbotService;
    this.fitnessData = this.loadFitnessData();
  }

  loadFitnessData() {
    try {
      return JSON.parse(
        fs.readFileSync(path.join(__dirname, '..', 'data', 'fitness-businesses.json'), 'utf8')
      );
    } catch (error) {
      console.error('Error loading fitness data:', error);
      return [];
    }
  }

  // Process chatbot question
  processQuestion = async (req, res) => {
    try {
      const { question } = req.body;
      
      if (!question || typeof question !== 'string' || question.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Question is required and must be a non-empty string'
        });
      }

      // Use the sophisticated chatbot service for better responses
      const chatbotResponse = this.chatbotService.processQuestion(question.trim());
      
      // Check if this is a general conversation question
      const isGeneralQuestion = this.isGeneralConversation(question.trim());
      
      if (isGeneralQuestion) {
        // For general questions, just return the chatbot response
        res.json({
          success: true,
          answer: chatbotResponse,
          question: question.trim(),
          data: [], // No business data for general questions
          appliedFilters: {},
          total: 0
        });
      } else {
        // For fitness-related questions, also get filtered data for display
        const naturalLanguageResult = this.processNaturalLanguageQuery(question.trim());
        
        res.json({
          success: true,
          answer: chatbotResponse, // Use the sophisticated chatbot response
          question: question.trim(),
          data: naturalLanguageResult.data, // Include filtered business data
          appliedFilters: naturalLanguageResult.appliedFilters,
          total: naturalLanguageResult.total
        });
      }
    } catch (error) {
      console.error('Error in processQuestion:', error);
      res.status(500).json({
        success: false,
        message: 'Error processing your question',
        error: error.message
      }); 
    }
  };

  // Check if the question is a general conversation question
  isGeneralConversation(question) {
    const lowerQuestion = question.toLowerCase();
    const generalKeywords = [
      'hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening',
      'how are you', 'how are you doing', 'how do you do', 'what\'s up', 'how\'s it going',
      'thank you', 'thanks', 'thank you very much', 'appreciate it',
      'bye', 'goodbye', 'see you', 'see you later', 'take care',
      'help', 'what can you do', 'what do you do', 'how can you help',
      'who are you', 'what are you', 'tell me about yourself',
      'what is gymlink', 'how many businesses', 'what cities', 'what categories',
      'how much does it cost', 'do you have reviews', 'can i compare',
      'is it free', 'how do i join', 'what services'
    ];
    
    return generalKeywords.some(keyword => lowerQuestion.includes(keyword));
  }

  // Process natural language query (same logic as businessService)
  processNaturalLanguageQuery(query) {
    const lowerQuery = query.toLowerCase();
    const filters = {};
    
    // Extract category
    const categories = ['gym', 'yoga', 'pilates', 'boxing'];
    categories.forEach(category => {
      if (lowerQuery.includes(category)) {
        filters.category = category.charAt(0).toUpperCase() + category.slice(1);
      }
    });
    
    // Extract location
    const locationMap = {
      'sydney': 'Sydney',
      'melbourne': 'Melbourne', 
      'brisbane': 'Brisbane',
      'perth': 'Perth',
      'adelaide': 'Adelaide',
      'canberra': 'Canberra',
      'gold coast': 'Gold Coast'
    };
    
    Object.keys(locationMap).forEach(locationKey => {
      if (lowerQuery.includes(locationKey)) {
        filters.location = locationMap[locationKey];
      }
    });
    
    // Extract price indicators
    if (lowerQuery.includes('cheap') || lowerQuery.includes('affordable') || lowerQuery.includes('budget')) {
      filters.maxPrice = 35;
    } else if (lowerQuery.includes('expensive') || lowerQuery.includes('premium')) {
      filters.minPrice = 45;
    }
    
    // Extract services
    const services = [
      // Traditional gym services
      'sauna', 'pool', 'pt', 'personal training', 'group classes', 'childcare', '24/7 access',
      // Yoga & wellness services
      'meditation', 'yoga mats', 'tea lounge', 'hot yoga', 'vinyasa flow', 'yin yoga', 'breathwork', 'workshops',
      // Boxing & martial arts
      'sparring', 'fitness testing', 'karate', 'taekwondo', 'jiu-jitsu', 'muay thai', 'self defense',
      // Pilates services
      'reformer pilates', 'mat pilates', 'private sessions', 'prenatal classes',
      // Community & lifestyle
      'nutrition counseling', 'social events', 'flexible hours', 'online classes', 'mobile app', 'home workouts',
      // Tech & modern
      'vr workouts', 'ai personal training', 'wearable integration', 'smart equipment',
      // CrossFit services
      'wod classes', 'olympic lifting', 'gymnastics', 'nutrition coaching', 'open gym',
      // Dance services
      'zumba', 'hip hop', 'ballet', 'jazz', 'salsa', 'belly dance',
      // Swimming services
      'swimming lessons', 'aqua aerobics', 'water polo', 'lap swimming', 'kids classes',
      // Cycling services
      'indoor cycling', 'spin classes', 'bike maintenance', 'group rides', 'virtual races',
      // Climbing services
      'rock climbing', 'bouldering', 'belay training', 'kids climbing', 'equipment rental',
      // Tennis services
      'tennis lessons', 'court rental', 'tournaments', 'kids programs', 'private coaching',
      // Wellness services
      'massage therapy', 'spa treatments', 'aromatherapy', 'wellness coaching',
      // Functional training
      'kettlebell training', 'trx', 'battle ropes', 'sandbag workouts', 'mobility training',
      // Barre services
      'barre classes', 'pilates fusion', 'stretching', 'posture correction',
      // Outdoor fitness
      'bootcamp', 'trail running', 'outdoor yoga', 'hiking', 'beach workouts',
      // Senior fitness
      'low impact classes', 'balance training', 'chair yoga', 'social activities', 'health monitoring',
      // Kids fitness
      'kids yoga', 'gymnastics', 'sports skills', 'fun games', 'coordination training',
      // Rehabilitation
      'physical therapy', 'injury recovery', 'post-surgery rehab', 'pain management', 'therapeutic exercise'
    ];
    services.forEach(service => {
      if (lowerQuery.includes(service)) {
        if (!filters.services) filters.services = [];
        filters.services.push(service);
      }
    });

    // Extract vibe
    const vibes = ['calm', 'wellness', 'intense', 'performance', 'community', 'modern', 'flexible', 'tech-forward'];
    vibes.forEach(vibe => {
      if (lowerQuery.includes(vibe)) {
        filters.vibe = vibe;
      }
    });

    // Filter businesses based on extracted filters
    let filteredData = [...this.fitnessData];

    if (filters.category) {
      filteredData = filteredData.filter(business => 
        business.category.toLowerCase() === filters.category.toLowerCase()
      );
    }

    if (filters.location) {
      filteredData = filteredData.filter(business => 
        business.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.minPrice) {
      filteredData = filteredData.filter(business => 
        business.price >= parseInt(filters.minPrice)
      );
    }

    if (filters.maxPrice) {
      filteredData = filteredData.filter(business => 
        business.price <= parseInt(filters.maxPrice)
      );
    }

    if (filters.vibe) {
      filteredData = filteredData.filter(business => 
        business.vibe.toLowerCase().includes(filters.vibe.toLowerCase())
      );
    }

    if (filters.services && filters.services.length > 0) {
      filteredData = filteredData.filter(business =>
        filters.services.some(service =>
          business.services.some(businessService =>
            businessService.toLowerCase().includes(service.toLowerCase())
          )
        )
      );
    }

    // Generate answer based on results
    let answer = this.generateAnswerFromResults(filteredData, filters, query);

    return {
      answer: answer,
      data: filteredData,
      appliedFilters: filters,
      total: filteredData.length
    };
  }

  // Generate answer based on filtered results
  generateAnswerFromResults(filteredData, filters, originalQuery) {
    if (filteredData.length === 0) {
      return "I couldn't find any businesses matching your criteria. Try asking about different locations, categories, or services.";
    }

    if (filteredData.length === 1) {
      const business = filteredData[0];
      return `I found ${business.name} in ${business.location}. It's a ${business.category.toLowerCase()} with a ${business.vibe.toLowerCase()} vibe, priced at $${business.price}/week. They offer: ${business.services.join(', ')}.`;
    }

    if (filteredData.length <= 3) {
      const businessList = filteredData.map(b => `${b.name} (${b.location}) - $${b.price}/week`).join(', ');
      return `Here are the businesses I found: ${businessList}. Would you like more details about any specific one?`;
    }

    // For more results, show top 3 and mention total
    const topResults = filteredData.slice(0, 3);
    const businessList = topResults.map(b => `${b.name} (${b.location}) - $${b.price}/week`).join(', ');
    return `I found ${filteredData.length} businesses matching your criteria. The top options include: ${businessList}. Would you like me to narrow down the search with more specific criteria?`;
  }

  // Get chatbot capabilities
  getCapabilities = async (req, res) => {
    try {
      // Generate dynamic data from fitness businesses
      const categories = [...new Set(this.fitnessData.map(business => business.category))];
      const locations = [...new Set(this.fitnessData.map(business => business.location))];
      const services = [...new Set(this.fitnessData.flatMap(business => business.services))];
      const vibes = [...new Set(this.fitnessData.map(business => business.vibe))];
      
      const minPrice = Math.min(...this.fitnessData.map(business => business.price));
      const maxPrice = Math.max(...this.fitnessData.map(business => business.price));
      const avgPrice = Math.round(this.fitnessData.reduce((sum, business) => sum + business.price, 0) / this.fitnessData.length);

      // Generate dynamic example questions based on actual data
      const exampleQuestions = this.generateExampleQuestions(categories, locations, services, vibes, minPrice, maxPrice);

      const capabilities = {
        canAnswer: [
          'Questions about fitness businesses',
          'Location-based queries',
          'Price comparisons',
          'Service availability',
          'Business recommendations',
          'General statistics',
          'Category-specific information',
          'Vibe and atmosphere queries'
        ],
        exampleQuestions: exampleQuestions,
        dataSource: `Fitness businesses database with ${this.fitnessData.length} businesses across Australia`,
        availableData: {
          totalBusinesses: this.fitnessData.length,
          categories: categories,
          locations: locations,
          priceRange: { min: minPrice, max: maxPrice, average: avgPrice },
          totalServices: services.length,
          vibes: vibes
        }
      };

      res.json({
        success: true,
        data: capabilities
      });
    } catch (error) {
      console.error('Error in getCapabilities:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching chatbot capabilities',
        error: error.message
      });
    }
  };

  // Generate dynamic example questions based on actual data
  generateExampleQuestions(categories, locations, services, vibes, minPrice, maxPrice) {
    const questions = [];
    
    // Location-based questions
    if (locations.length > 0) {
      const randomLocation = locations[Math.floor(Math.random() * locations.length)];
      questions.push(`What ${categories[0]?.toLowerCase() || 'gyms'} are in ${randomLocation}?`);
    }

    // Price-based questions
    questions.push(`Show me cheap ${categories[0]?.toLowerCase() || 'gyms'}`);
    questions.push(`What's the average price for ${categories[0]?.toLowerCase() || 'gyms'}?`);

    // Service-based questions
    if (services.length > 0) {
      const randomService = services[Math.floor(Math.random() * services.length)];
      questions.push(`Which ${categories[0]?.toLowerCase() || 'gyms'} have ${randomService.toLowerCase()}?`);
    }

    // Category-specific questions
    if (categories.length > 1) {
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      questions.push(`Tell me about ${randomCategory.toLowerCase()} classes`);
    }

    // Recommendation questions
    if (services.length > 0) {
      const randomService = services[Math.floor(Math.random() * services.length)];
      questions.push(`Recommend a ${categories[0]?.toLowerCase() || 'gym'} with ${randomService.toLowerCase()}`);
    }

    // Vibe-based questions
    if (vibes.length > 0) {
      const randomVibe = vibes[Math.floor(Math.random() * vibes.length)];
      questions.push(`Find ${categories[0]?.toLowerCase() || 'gyms'} with ${randomVibe.toLowerCase()} vibe`);
    }

    // Statistics questions
    questions.push(`How many ${categories[0]?.toLowerCase() || 'gyms'} are there?`);
    questions.push(`What's the price range for fitness businesses?`);

    // Remove duplicates and limit to 8 questions
    return [...new Set(questions)].slice(0, 8);
  }
}

module.exports = new ChatbotController();
