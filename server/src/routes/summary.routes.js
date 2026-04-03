const express = require('express');
const router = express.Router();
const summaryController = require('../controllers/summary.controller');
const { validateRequest } = require('../middleware/validateRequest');
const { SUMMARY_MODES } = require('../utils/constants');

/**
 * Summary Routes
 * Base path: /api/summaries
 */

/**
 * @route   POST /api/summaries/generate
 * @desc    Generate a summary for a document
 * @access  Public
 */
router.post(
  '/generate',
  validateRequest({
    body: {
      documentId: { type: 'string', required: true },
      userId: { type: 'string', required: true },
      mode: { 
        type: 'string', 
        required: true,
        enum: Object.values(SUMMARY_MODES)
      }
    }
  }),
  summaryController.generateSummary
);

/**
 * @route   GET /api/summaries/modes
 * @desc    Get available summary modes
 * @access  Public
 */
router.get('/modes', summaryController.getSummaryModes);

/**
 * @route   GET /api/summaries/:summaryId
 * @desc    Get a summary by ID
 * @access  Public
 */
router.get(
  '/:summaryId',
  validateRequest({
    params: {
      summaryId: { type: 'string', required: true }
    }
  }),
  summaryController.getSummary
);

/**
 * @route   GET /api/summaries/user/:userId
 * @desc    Get all summaries for a user
 * @access  Public
 */
router.get(
  '/user/:userId',
  validateRequest({
    params: {
      userId: { type: 'string', required: true }
    }
  }),
  summaryController.getUserSummaries
);

/**
 * @route   GET /api/summaries/document/:documentId
 * @desc    Get all summaries for a document
 * @access  Public
 */
router.get(
  '/document/:documentId',
  validateRequest({
    params: {
      documentId: { type: 'string', required: true }
    }
  }),
  summaryController.getDocumentSummaries
);

/**
 * @route   DELETE /api/summaries/:summaryId
 * @desc    Delete a summary
 * @access  Public
 */
router.delete(
  '/:summaryId',
  validateRequest({
    params: {
      summaryId: { type: 'string', required: true }
    }
  }),
  summaryController.deleteSummary
);

module.exports = router;

// Made with Bob
