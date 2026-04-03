/**
 * Helper utility functions
 */

/**
 * Counts words in a text
 * @param {string} text - The text to count words in
 * @returns {number} - Word count
 */
const countWords = (text) => {
  if (!text) return 0;
  return text.trim().split(/\s+/).length;
};

/**
 * Cleans extracted text
 * @param {string} text - The text to clean
 * @returns {string} - Cleaned text
 */
const cleanText = (text) => {
  if (!text) return '';
  
  return text
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .replace(/\n{3,}/g, '\n\n') // Replace multiple newlines with double newline
    .trim();
};

/**
 * Calculates compression ratio
 * @param {number} originalCount - Original word count
 * @param {number} summaryCount - Summary word count
 * @returns {number} - Compression ratio as percentage
 */
const calculateCompressionRatio = (originalCount, summaryCount) => {
  if (originalCount === 0) return 0;
  return parseFloat(((1 - summaryCount / originalCount) * 100).toFixed(1));
};

/**
 * Validates email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Creates a standardized API response
 * @param {boolean} success - Success status
 * @param {*} data - Response data
 * @param {string} message - Optional message
 * @returns {Object} - Standardized response object
 */
const createResponse = (success, data = null, message = null) => {
  const response = { success };
  
  if (data !== null) {
    response.data = data;
  }
  
  if (message) {
    response.message = message;
  }
  
  return response;
};

/**
 * Creates a standardized error response
 * @param {string} code - Error code
 * @param {string} message - Error message
 * @param {*} details - Optional error details
 * @returns {Object} - Standardized error response
 */
const createErrorResponse = (code, message, details = null) => {
  const response = {
    success: false,
    error: {
      code,
      message
    }
  };
  
  if (details) {
    response.error.details = details;
  }
  
  return response;
};

module.exports = {
  countWords,
  cleanText,
  calculateCompressionRatio,
  isValidEmail,
  createResponse,
  createErrorResponse
};

// Made with Bob
