const express = require('express');
const router = express.Router();

// Import route modules
const businessRoutes = require('./businesses');
const chatbotRoutes = require('./chatbot');

// Use route modules
router.use('/businesses', businessRoutes);
router.use('/chatbot', chatbotRoutes);

module.exports = router;