require('dotenv').config();
const app = require('./src/app');
const { PORT } = require('./src/utils/constants');

/**
 * Server Entry Point
 */

const port = process.env.PORT || PORT;

// Start server
const server = app.listen(port, () => {
  console.log('='.repeat(50));
  console.log('🚀 AI Document Summarizer API Server');
  console.log('='.repeat(50));
  console.log(`📡 Server running on port ${port}`);
  console.log(`🌐 Local: http://localhost:${port}`);
  console.log(`📚 API Base: http://localhost:${port}/api`);
  console.log(`💚 Health Check: http://localhost:${port}/api/health`);
  console.log('='.repeat(50));
  console.log('📋 Available Endpoints:');
  console.log(`   POST   /api/users`);
  console.log(`   GET    /api/users/:userId`);
  console.log(`   PUT    /api/users/:userId`);
  console.log(`   POST   /api/documents/upload`);
  console.log(`   GET    /api/documents/:documentId`);
  console.log(`   GET    /api/documents/user/:userId`);
  console.log(`   POST   /api/summaries/generate`);
  console.log(`   GET    /api/summaries/modes`);
  console.log(`   GET    /api/summaries/:summaryId`);
  console.log(`   GET    /api/summaries/user/:userId`);
  console.log('='.repeat(50));
  console.log('✅ Server is ready to accept requests');
  console.log('='.repeat(50));
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\nSIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Made with Bob
