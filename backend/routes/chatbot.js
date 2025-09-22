const express = require('express');
const router = express.Router();
const chatbotController = require('../controllers/chatbotController');

// Process chatbot question
router.post('/', chatbotController.processQuestion);

// Get chatbot capabilities
router.get('/capabilities', chatbotController.getCapabilities);

module.exports = router;
