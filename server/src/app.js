const express = require('express');
const cors = require('cors');
const corsConfig = require('./config/cors.config');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./middleware/logger');

/**
 * Express Application Setup
 */

const app = express();

// Trust proxy (for deployment behind reverse proxies)
app.set('trust proxy', 1);

// Request logging middleware
app.use(logger);

// CORS configuration
app.use(cors(corsConfig));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to AI Document Summarizer API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      users: '/api/users',
      documents: '/api/documents',
      summaries: '/api/summaries'
    },
    documentation: 'See PROJECT_PLAN.md for API documentation'
  });
});

// Mount API routes
app.use('/api', routes);

// Global error handler (must be last)
app.use(errorHandler);

module.exports = app;

// Made with Bob
