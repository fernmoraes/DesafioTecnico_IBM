const express = require('express');
const router = express.Router();

const userRoutes = require('./user.routes');
const documentRoutes = require('./document.routes');
const summaryRoutes = require('./summary.routes');

/**
 * API Routes Index
 * Aggregates all route modules
 */

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'AI Document Summarizer API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Mount route modules
router.use('/users', userRoutes);
router.use('/documents', documentRoutes);
router.use('/summaries', summaryRoutes);

// 404 handler for undefined API routes
router.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `API endpoint not found: ${req.method} ${req.originalUrl}`
    }
  });
});

module.exports = router;

// Made with Bob
