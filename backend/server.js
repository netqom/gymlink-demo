const express = require('express');
const cors = require('cors');
const helmet = require('helmet'); 
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

 
//routes
const apiRoutes = require('./routes'); 
app.use('/api', apiRoutes);

// server
app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`); 
  console.log(`API available at http://localhost:${PORT}/api`);
});
