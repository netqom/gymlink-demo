const express = require('express');
const router = express.Router();
const businessController = require('../controllers/businessController');

// Get all businesses with filtering
router.get('/', businessController.getAllBusinesses);

// Get single business by ID
router.get('/:id', businessController.getBusinessById);
router.post('/search/natural', businessController.naturalLanguageSearch);

// Get all filter options
router.get('/search/filter', businessController.getFilterOptions);

module.exports = router;
