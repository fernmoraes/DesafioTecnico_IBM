const storageService = require('../services/storage.service');
const watsonxService = require('../services/watsonx.service');
const { createResponse, createErrorResponse } = require('../utils/helpers');
const { HTTP_STATUS, ERROR_CODES, SUMMARY_MODES } = require('../utils/constants');

/**
 * Summary Controller
 * Handles AI summary generation
 */

/**
 * Generates a summary for a document
 */
const generateSummary = async (req, res, next) => {
  try {
    const { documentId, userId, mode } = req.body;

    // Validate required fields
    if (!documentId || !userId || !mode) {
      const error = new Error('Missing required fields: documentId, userId, and mode are required');
      error.name = 'ValidationError';
      return next(error);
    }

    // Validate mode
    const validModes = Object.values(SUMMARY_MODES);
    if (!validModes.includes(mode)) {
      const error = new Error(`Invalid summary mode. Must be one of: ${validModes.join(', ')}`);
      error.name = 'ValidationError';
      return next(error);
    }

    // Validate user exists
    const user = storageService.getUser(userId);
    if (!user) {
      const error = new Error('User not found');
      error.name = 'NotFoundError';
      return next(error);
    }

    // Get document
    const document = storageService.getDocument(documentId);
    if (!document) {
      const error = new Error('Document not found');
      error.name = 'NotFoundError';
      return next(error);
    }

    // Verify document belongs to user
    if (document.userId !== userId) {
      const error = new Error('Unauthorized: Document does not belong to this user');
      error.name = 'UnauthorizedError';
      return next(error);
    }

    // Generate summary using watsonx
    let summaryText;
    try {
      summaryText = await watsonxService.generateSummary(document.textContent, mode);
    } catch (aiError) {
      console.error('AI generation error:', aiError);
      const error = new Error(`Failed to generate summary: ${aiError.message}`);
      error.name = 'AIServiceError';
      return next(error);
    }

    // Create summary record
    const summary = storageService.createSummary({
      userId,
      documentId,
      mode,
      summaryText,
      originalFilename: document.filename
    });

    res.status(HTTP_STATUS.CREATED).json(createResponse(true, summary));
  } catch (error) {
    next(error);
  }
};

/**
 * Gets a summary by ID
 */
const getSummary = async (req, res, next) => {
  try {
    const { summaryId } = req.params;

    const summary = storageService.getSummary(summaryId);

    if (!summary) {
      const error = new Error('Summary not found');
      error.name = 'NotFoundError';
      return next(error);
    }

    res.status(HTTP_STATUS.OK).json(createResponse(true, summary));
  } catch (error) {
    next(error);
  }
};

/**
 * Gets all summaries for a user
 */
const getUserSummaries = async (req, res, next) => {
  try {
    const { userId } = req.params;

    // Validate user exists
    const user = storageService.getUser(userId);
    if (!user) {
      const error = new Error('User not found');
      error.name = 'NotFoundError';
      return next(error);
    }

    const summaries = storageService.getSummariesByUser(userId);

    res.status(HTTP_STATUS.OK).json(createResponse(true, summaries));
  } catch (error) {
    next(error);
  }
};

/**
 * Gets all summaries for a specific document
 */
const getDocumentSummaries = async (req, res, next) => {
  try {
    const { documentId } = req.params;

    // Validate document exists
    const document = storageService.getDocument(documentId);
    if (!document) {
      const error = new Error('Document not found');
      error.name = 'NotFoundError';
      return next(error);
    }

    const summaries = storageService.getSummariesByDocument(documentId);

    res.status(HTTP_STATUS.OK).json(createResponse(true, summaries));
  } catch (error) {
    next(error);
  }
};

/**
 * Deletes a summary
 */
const deleteSummary = async (req, res, next) => {
  try {
    const { summaryId } = req.params;

    const deleted = storageService.deleteSummary(summaryId);

    if (!deleted) {
      const error = new Error('Summary not found');
      error.name = 'NotFoundError';
      return next(error);
    }

    res.status(HTTP_STATUS.OK).json(createResponse(true, { 
      message: 'Summary deleted successfully',
      summaryId 
    }));
  } catch (error) {
    next(error);
  }
};

/**
 * Gets available summary modes
 */
const getSummaryModes = async (req, res, next) => {
  try {
    const modes = Object.entries(SUMMARY_MODES).map(([key, value]) => ({
      id: value,
      name: key.split('_').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      ).join(' '),
      description: getModeDescription(value)
    }));

    res.status(HTTP_STATUS.OK).json(createResponse(true, modes));
  } catch (error) {
    next(error);
  }
};

/**
 * Helper function to get mode descriptions
 */
function getModeDescription(mode) {
  const descriptions = {
    [SUMMARY_MODES.TLDR]: 'Quick 2-3 sentence summary of the main points',
    [SUMMARY_MODES.DETAILED]: 'Comprehensive summary with key details and context',
    [SUMMARY_MODES.BULLET_POINTS]: 'Organized bullet-point list of main ideas',
    [SUMMARY_MODES.ELI5]: 'Simple explanation that anyone can understand'
  };
  return descriptions[mode] || 'Summary mode';
}

module.exports = {
  generateSummary,
  getSummary,
  getUserSummaries,
  getDocumentSummaries,
  deleteSummary,
  getSummaryModes
};

// Made with Bob
