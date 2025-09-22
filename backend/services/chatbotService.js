const path = require('path');
const fs = require('fs');

class ChatbotService {
  constructor() {
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

  processQuestion(question) {
    const lowerQuestion = question.toLowerCase();
    
    // Check for general conversation questions first
    const generalResponse = this.handleGeneralQuestions(lowerQuestion);
    if (generalResponse) {
      return generalResponse;
    }
    
    // Extract keywords and intent
    const keywords = this.extractKeywords(lowerQuestion);
    const intent = this.determineIntent(lowerQuestion);
    
    // Generate response based on intent and keywords
    return this.generateResponse(intent, keywords, question);
  }

  // Handle general conversation questions
  handleGeneralQuestions(question) {
    const greetings = ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening'];
    const howAreYou = ['how are you', 'how are you doing', 'how do you do', 'what\'s up', 'how\'s it going'];
    const thanks = ['thank you', 'thanks', 'thank you very much', 'appreciate it'];
    const goodbyes = ['bye', 'goodbye', 'see you', 'see you later', 'take care'];
    const help = ['help', 'what can you do', 'what do you do', 'how can you help'];
    const about = ['who are you', 'what are you', 'tell me about yourself'];
    
    // Greetings
    if (greetings.some(greeting => question.includes(greeting))) {
      return "Hello! 👋 I'm your fitness assistant. I can help you find the perfect gym, yoga studio, or fitness business. What are you looking for today?";
    }
    
    // How are you questions
    if (howAreYou.some(phrase => question.includes(phrase))) {
      return "I'm doing great, thank you for asking! 😊 I'm here and ready to help you find the best fitness options. What type of workout or fitness activity interests you?";
    }
    
    // Thank you responses
    if (thanks.some(phrase => question.includes(phrase))) {
      return "You're very welcome! 😊 I'm happy to help. Is there anything else you'd like to know about fitness businesses?";
    }
    
    // Goodbye responses
    if (goodbyes.some(phrase => question.includes(phrase))) {
      return "Goodbye! 👋 Thanks for using GymLink. I hope you found what you were looking for. Have a great workout!";
    }
    
    // Help questions
    if (help.some(phrase => question.includes(phrase))) {
      return "I can help you find fitness businesses! 🏋️‍♀️ You can ask me about:\n• Gyms, yoga studios, CrossFit, dance classes\n• Specific locations like Sydney, Melbourne, Brisbane\n• Services like swimming, martial arts, climbing\n• Price ranges (cheap, expensive, budget-friendly)\n• Specific amenities like sauna, pool, personal training\n\nWhat would you like to find?";
    }
    
    // About questions
    if (about.some(phrase => question.includes(phrase))) {
      return "I'm your AI fitness assistant for GymLink! 🤖 I help people find the perfect fitness businesses across Australia. I can search through our database of gyms, yoga studios, CrossFit boxes, dance studios, swimming centers, and more. Just tell me what you're looking for!";
    }
    
    // General Q&A
    const generalQA = {
      'what is gymlink': 'GymLink is Australia\'s first fitness comparison platform! We help you find and compare gyms, yoga studios, and fitness businesses across the country.',
      'how many businesses': `We have ${this.fitnessData.length} fitness businesses in our database, covering all major Australian cities.`,
      'what cities': 'We cover Sydney, Melbourne, Brisbane, Perth, Adelaide, Gold Coast, and Canberra.',
      'what categories': 'We have gyms, yoga studios, Pilates, boxing, CrossFit, dance, swimming, martial arts, cycling, climbing, tennis, wellness centers, and more!',
      'how much does it cost': 'Prices vary by location and services. You can find options from $20/week for basic gyms to $70/week for premium facilities with spa services.',
      'do you have reviews': 'Yes! All our businesses have ratings from 4.2 to 4.9 stars based on customer feedback.',
      'can i compare': 'Absolutely! You can compare up to 4 businesses at once to see their features, prices, and services side by side.',
      'is it free': 'Yes, using GymLink to search and compare fitness businesses is completely free!',
      'how do i join': 'Once you find a business you like, you can contact them directly through our platform to sign up for membership.',
      'what services': 'We offer search, filtering, comparison, natural language search, personalized recommendations, and a helpful chatbot assistant!'
    };
    
    for (const [key, answer] of Object.entries(generalQA)) {
      if (question.includes(key)) {
        return answer;
      }
    }
    
    return null; // No general response found
  }

  extractKeywords(question) {
    const keywords = {
      categories: [],
      locations: [],
      services: [],
      price: null,
      vibe: null
    };

    // Extract categories
    const categories = [
      'gym', 'yoga', 'pilates', 'boxing', 'fitness', 'crossfit', 'dance', 'swimming', 
      'martial arts', 'cycling', 'climbing', 'tennis', 'wellness', 'functional training', 
      'barre', 'outdoor fitness', 'senior fitness', 'kids fitness', 'rehabilitation'
    ];
    categories.forEach(category => {
      if (question.includes(category)) {
        keywords.categories.push(category);
      }
    });

    // Extract locations
    const locations = ['sydney', 'melbourne', 'brisbane', 'perth', 'adelaide', 'canberra', 'gold coast'];
    locations.forEach(location => {
      if (question.includes(location)) {
        keywords.locations.push(location);
      }
    });

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
      if (question.includes(service)) {
        keywords.services.push(service);
      }
    });

    // Extract price indicators
    if (question.includes('cheap') || question.includes('budget') || question.includes('affordable')) {
      keywords.price = 'budget';
    } else if (question.includes('expensive') || question.includes('premium') || question.includes('luxury')) {
      keywords.price = 'premium';
    }

    // Extract vibe
    const vibes = ['calm', 'wellness', 'intense', 'performance', 'community', 'modern', 'flexible'];
    vibes.forEach(vibe => {
      if (question.includes(vibe)) {
        keywords.vibe = vibe;
      }
    });

    return keywords;
  }

  determineIntent(question) {
    if (question.includes('what') || question.includes('which') || question.includes('show me') || question.includes('tell me')) {
      return 'information';
    } else if (question.includes('how much') || question.includes('price') || question.includes('cost')) {
      return 'pricing';
    } else if (question.includes('where') || question.includes('location')) {
      return 'location';
    } else if (question.includes('when') || question.includes('hours') || question.includes('time')) {
      return 'hours';
    } else if (question.includes('best') || question.includes('recommend') || question.includes('top')) {
      return 'recommendation';
    } else if (question.includes('average') || question.includes('statistics') || question.includes('summary')) {
      return 'statistics';
    } else {
      return 'general';
    }
  }

  generateResponse(intent, keywords, originalQuestion) {
    let filteredData = [...this.fitnessData];

    // Apply filters based on keywords
    if (keywords.categories.length > 0) {
      filteredData = filteredData.filter(business =>
        keywords.categories.some(category =>
          business.category.toLowerCase().includes(category)
        )
      );
    }

    if (keywords.locations.length > 0) {
      filteredData = filteredData.filter(business =>
        keywords.locations.some(location =>
          business.location.toLowerCase().includes(location)
        )
      );
    }

    if (keywords.services.length > 0) {
      filteredData = filteredData.filter(business =>
        keywords.services.some(service =>
          business.services.some(businessService =>
            businessService.toLowerCase().includes(service)
          )
        )
      );
    }

    if (keywords.price === 'budget') {
      filteredData = filteredData.filter(business => business.price <= 35);
    } else if (keywords.price === 'premium') {
      filteredData = filteredData.filter(business => business.price >= 45);
    }

    // Generate response based on intent
    switch (intent) {
      case 'information':
        return this.generateInformationResponse(filteredData, keywords, originalQuestion);
      case 'pricing':
        return this.generatePricingResponse(filteredData, keywords);
      case 'location':
        return this.generateLocationResponse(filteredData, keywords);
      case 'recommendation':
        return this.generateRecommendationResponse(filteredData, keywords);
      case 'statistics':
        return this.generateStatisticsResponse(filteredData, keywords);
      default:
        return this.generateGeneralResponse(filteredData, keywords, originalQuestion);
    }
  }

  generateInformationResponse(data, keywords, question) {
    if (data.length === 0) {
      return "I couldn't find any businesses matching your criteria. Try asking about gyms, yoga studios, or specific locations like Sydney or Melbourne.";
    }

    if (data.length === 1) {
      const business = data[0];
      return `I found ${business.name} in ${business.location}. It's a ${business.category.toLowerCase()} with a ${business.vibe.toLowerCase()} vibe, priced at $${business.price}/week. They offer: ${business.services.join(', ')}.`;
    }

    if (data.length <= 3) {
      const businessList = data.map(b => `${b.name} (${b.location}) - $${b.price}/week`).join(', ');
      return `Here are the businesses I found: ${businessList}. Would you like more details about any specific one?`;
    }

    return `I found ${data.length} businesses matching your criteria. The top options include ${data.slice(0, 3).map(b => b.name).join(', ')}. Would you like me to narrow down the search with more specific criteria?`;
  }

  generatePricingResponse(data, keywords) {
    if (data.length === 0) {
      return "I couldn't find pricing information for your criteria. Try asking about specific types of businesses or locations.";
    }

    const prices = data.map(b => b.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const avgPrice = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);

    if (keywords.price === 'budget') {
      const budgetOptions = data.filter(b => b.price <= 35);
      return `For budget-friendly options, I found ${budgetOptions.length} businesses under $35/week. The cheapest is ${budgetOptions[0]?.name} at $${minPrice}/week.`;
    }

    return `Based on the ${data.length} businesses I found, prices range from $${minPrice} to $${maxPrice} per week, with an average of $${avgPrice}/week.`;
  }

  generateLocationResponse(data, keywords) {
    if (data.length === 0) {
      return "I couldn't find any businesses in that location. Try asking about Sydney, Melbourne, Brisbane, Perth, Adelaide, Canberra, or Gold Coast.";
    }

    const locations = [...new Set(data.map(b => b.location))];
    const locationList = locations.join(', ');
    
    return `I found businesses in: ${locationList}. There are ${data.length} total businesses in these locations.`;
  }

  generateRecommendationResponse(data, keywords) {
    if (data.length === 0) {
      return "I couldn't find any businesses to recommend based on your criteria. Try being more specific about what you're looking for.";
    }

    // Sort by rating and return top recommendation
    const sorted = data.sort((a, b) => b.rating - a.rating);
    const top = sorted[0];
    
    return `I recommend ${top.name} in ${top.location}! It's a ${top.category.toLowerCase()} with a ${top.rating}/5 rating and ${top.vibe.toLowerCase()} vibe. Priced at $${top.price}/week, they offer: ${top.services.join(', ')}.`;
  }

  generateStatisticsResponse(data, keywords) {
    if (data.length === 0) {
      return "I don't have enough data to provide statistics for your criteria.";
    }

    const categories = [...new Set(data.map(b => b.category))];
    const locations = [...new Set(data.map(b => b.location))];
    const avgPrice = Math.round(data.reduce((sum, b) => sum + b.price, 0) / data.length);
    const avgRating = Math.round((data.reduce((sum, b) => sum + b.rating, 0) / data.length) * 10) / 10;

    return `Here's what I found: ${data.length} businesses across ${categories.length} categories (${categories.join(', ')}) in ${locations.length} locations. Average price: $${avgPrice}/week, average rating: ${avgRating}/5.`;
  }

  generateGeneralResponse(data, keywords, question) {
    if (data.length === 0) {
      return "I'm here to help you find fitness businesses! You can ask me about gyms, yoga studios, locations, prices, or specific services. What would you like to know?";
    }

    return `I found ${data.length} businesses that might interest you. You can ask me more specific questions like "What's the cheapest option?" or "Tell me about gyms with saunas."`;
  }
}

module.exports = new ChatbotService();
