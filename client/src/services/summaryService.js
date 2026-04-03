import api from './api';

/**
 * Summary Service
 * Handles all summary-related API calls
 */

/**
 * Generates a summary for a document
 * @param {Object} data - Summary generation data
 * @param {string} data.userId - User ID
 * @param {string} data.documentId - Document ID
 * @param {string} data.mode - Summary mode (tldr, detailed, bullets, eli5)
 * @param {string} data.textContent - Text content to summarize
 * @returns {Promise<Object>} - Summary object
 */
export const generateSummary = async (data) => {
  const response = await api.post('/summaries/generate', data);
  return response.data;
};

/**
 * Gets a specific summary by ID
 * @param {string} summaryId - Summary ID
 * @returns {Promise<Object>} - Summary object
 */
export const getSummary = async (summaryId) => {
  const response = await api.get(`/summaries/${summaryId}`);
  return response.data;
};

/**
 * Gets all summaries for a user
 * @param {string} userId - User ID
 * @param {Object} params - Query parameters { limit, offset }
 * @returns {Promise<Object>} - Object with summaries array and pagination info
 */
export const getUserSummaries = async (userId, params = {}) => {
  const queryParams = new URLSearchParams(params).toString();
  const url = `/summaries/user/${userId}${queryParams ? `?${queryParams}` : ''}`;
  const response = await api.get(url);
  return response.data;
};

/**
 * Deletes a summary
 * @param {string} summaryId - Summary ID
 * @returns {Promise<Object>} - Success message
 */
export const deleteSummary = async (summaryId) => {
  const response = await api.delete(`/summaries/${summaryId}`);
  return response.data;
};

// Made with Bob
