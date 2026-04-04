const { isValidEmail } = require('../utils/helpers');

/**
 * Request validation middleware
 */

/**
 * Validates user creation request
 */
const validateUserCreation = (req, res, next) => {
  const { name, email } = req.body;
  
  if (!name || !email) {
    const error = new Error('Name and email are required');
    error.name = 'ValidationError';
    return next(error);
  }
  
  if (!isValidEmail(email)) {
    const error = new Error('Invalid email format');
    error.name = 'ValidationError';
    return next(error);
  }
  
  next();
};

/**
 * Validates summary generation request
 */
const validateSummaryGeneration = (req, res, next) => {
  const { documentId, mode } = req.body;
  
  if (!documentId || !mode) {
    const error = new Error('documentId and mode are required');
    error.name = 'ValidationError';
    return next(error);
  }
  
  const validModes = ['tldr', 'detailed', 'bullets', 'eli5'];
  if (!validModes.includes(mode)) {
    const error = new Error(`Invalid mode. Must be one of: ${validModes.join(', ')}`);
    error.name = 'ValidationError';
    return next(error);
  }
  
  next();
};

/**
 * Validates file upload request
 */
const validateFileUpload = (req, res, next) => {
  if (!req.file) {
    const error = new Error('No file uploaded');
    error.name = 'ValidationError';
    return next(error);
  }
  
  next();
};

module.exports = {
  validateUserCreation,
  validateSummaryGeneration,
  validateFileUpload
};

// Made with Bob
