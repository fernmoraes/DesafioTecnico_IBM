import api from './api';

/**
 * Document Service
 * Handles all document-related API calls
 */

/**
 * Uploads a document file
 * @param {File} file - The file to upload
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - Document object with extracted text
 */
export const uploadDocument = async (file, userId) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('userId', userId);

  const response = await api.post('/documents/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

/**
 * Gets document by ID
 * @param {string} documentId - Document ID
 * @returns {Promise<Object>} - Document object
 */
export const getDocument = async (documentId) => {
  const response = await api.get(`/documents/${documentId}`);
  return response.data;
};

/**
 * Gets all documents for a user
 * @param {string} userId - User ID
 * @returns {Promise<Array>} - Array of document objects
 */
export const getUserDocuments = async (userId) => {
  const response = await api.get(`/documents/user/${userId}`);
  return response.data;
};

// Made with Bob
