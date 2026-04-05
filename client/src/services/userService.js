import api from './api';

/**
 * User Service
 * Handles all user-related API calls
 */

/**
 * Creates a new user profile
 * @param {Object} userData - User data { name, email }
 * @returns {Promise<Object>} - Created user object
 */
export const createUser = async (userData) => {
  const response = await api.post('/users', userData);
  console.log('User created successfully:', response.data);
  return response.data;
};

/**
 * Gets user profile by ID
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - User object
 */
export const getUser = async (userId) => {
  const response = await api.get(`/users/${userId}`);
  return response.data;
};

/**
 * Updates user profile
 * @param {string} userId - User ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>} - Updated user object
 */
export const updateUser = async (userId, updates) => {
  const response = await api.put(`/users/${userId}`, updates);
  return response.data;
};

/**
 * Logs in a user by email
 * @param {string} email - User email
 * @returns {Promise<Object>} - User object
 */
export const loginUser = async (email) => {
  const response = await api.post('/users/login', { email });
  return response.data;
};

// Made with Bob
