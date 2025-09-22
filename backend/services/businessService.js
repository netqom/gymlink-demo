const path = require('path');
const fs = require('fs');
const { log } = require('console');

class BusinessService {
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

  // Get all businesses with filtering
  getAllBusinesses(filters = {}) {
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
        business.vibe === filters.vibe
      );
    }
    
    if (filters.service) {
      filteredData = filteredData.filter(business => 
        business.services.some(service => 
          service.toLowerCase().includes(filters.service.toLowerCase())
        )
      );
    }
    
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredData = filteredData.filter(business => 
        business.name.toLowerCase().includes(searchTerm) ||
        business.category.toLowerCase().includes(searchTerm) ||
        business.location.toLowerCase().includes(searchTerm) ||
        business.description.toLowerCase().includes(searchTerm)
      );
    }
    
    return {
      data: filteredData,
      total: filteredData.length
    };
  }

  // Get single business by ID
  getBusinessById(id) {
    return this.fitnessData.find(b => b.id === parseInt(id)) || null;
  }

  // Get filter options
  getFilterOptions() {
    const categories = [...new Set(this.fitnessData.map(business => business.category))];
    const locations = [...new Set(this.fitnessData.map(business => business.location))];
    const vibes = [...new Set(this.fitnessData.map(business => business.vibe))];
    const allServices = [...new Set(this.fitnessData.flatMap(business => business.services))];
    
    const minPrice = Math.min(...this.fitnessData.map(business => business.price));
    const maxPrice = Math.max(...this.fitnessData.map(business => business.price));
    
    return {
      categories,
      locations,
      vibes,
      services: allServices,
      priceRange: { min: minPrice, max: maxPrice }
    };
  }

  // Natural language search
  parseNaturalLanguageQuery(query) {
    const lowerQuery = query.toLowerCase();
    const filters = {};
    
    // Extract category
    const categoryMap = {
      'gym': 'Gym',
      'yoga': 'Yoga',
      'pilates': 'Pilates',
      'boxing': 'Boxing',
      'crossfit': 'CrossFit',
      'dance': 'Dance',
      'swimming': 'Swimming',
      'martial arts': 'Martial Arts',
      'cycling': 'Cycling',
      'climbing': 'Climbing',
      'tennis': 'Tennis',
      'wellness': 'Wellness',
      'functional training': 'Functional Training',
      'barre': 'Barre',
      'outdoor fitness': 'Outdoor Fitness',
      'senior fitness': 'Senior Fitness',
      'kids fitness': 'Kids Fitness',
      'rehabilitation': 'Rehabilitation'
    };
    
    Object.keys(categoryMap).forEach(categoryKey => {
      if (lowerQuery.includes(categoryKey)) {
        filters.category = categoryMap[categoryKey];
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
    // console.log(filters,'filtersfiltersfiltersfilters');
    return filters;
  }

  // Perform natural language search
  performNaturalLanguageSearch(query) {
    if (!query || typeof query !== 'string') {
      throw new Error('Query is required and must be a string');
    }

    const filters = this.parseNaturalLanguageQuery(query);
    const result = this.getAllBusinesses(filters);
    
    return {
      ...result,
      appliedFilters: filters,
      originalQuery: query
    };
  }
}

module.exports = new BusinessService();
