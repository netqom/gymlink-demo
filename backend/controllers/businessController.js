const businessService = require('../services/businessService');

class BusinessController {
  constructor() {
    this.businessService = businessService;
  }

  // Get all businesses with optional filters
  getAllBusinesses = async (req, res) => {
    try {
      const filters = {
        category: req.query.category,
        location: req.query.location,
        minPrice: req.query.minPrice,
        maxPrice: req.query.maxPrice,
        vibe: req.query.vibe,
        service: req.query.service,
        search: req.query.search
      };

      const result = this.businessService.getAllBusinesses(filters);
      
      res.json({
        success: true,
        data: result.data,
        total: result.total
      });
    } catch (error) {
      console.error('Error in getAllBusinesses:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching businesses',
        error: error.message
      });
    }
  };

  // Get single business by ID
  getBusinessById = async (req, res) => {
    try {
      const { id } = req.params;
      
      if (!id || isNaN(parseInt(id))) {
        return res.status(400).json({
          success: false,
          message: 'Valid business ID is required'
        });
      }

    const business = this.businessService.getBusinessById(id);
      
      if (!business) {
        return res.status(404).json({
          success: false,
          message: 'Business not found'
        });
      }
      
      res.json({
        success: true,
        data: business
      });
    } catch (error) {
      console.error('Error in getBusinessById:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching business',
        error: error.message
      });
    }
  };

  // Get filter options
  getFilterOptions = async (req, res) => {
    try {
      const filterOptions = this.businessService.getFilterOptions();
      
      res.json({
        success: true,
        data: filterOptions
      });
    } catch (error) {
      console.error('Error in getFilterOptions:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching filter options',
        error: error.message
      });
    }
  };

  // Natural language search
  naturalLanguageSearch = async (req, res) => {
    try {
      const { query } = req.body;
      
      if (!query) {
        return res.status(400).json({
          success: false,
          message: 'Query is required'
        });
      }

      const result = this.businessService.performNaturalLanguageSearch(query);
      
      res.json({
        success: true,
        data: result.data,
        total: result.total,
        appliedFilters: result.appliedFilters,
        originalQuery: result.originalQuery
      });
    } catch (error) {
      console.error('Error in naturalLanguageSearch:', error);
      res.status(500).json({
        success: false,
        message: 'Error processing natural language search',
        error: error.message
      });
    }
  };
}

module.exports = new BusinessController();
