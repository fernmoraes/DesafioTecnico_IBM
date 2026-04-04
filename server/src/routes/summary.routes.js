const express = require('express');
const router = express.Router();
const summaryController = require('../controllers/summary.controller');
const { validateSummaryGeneration } = require('../middleware/validateRequest');

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
  validateSummaryGeneration,
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
router.get('/:summaryId', summaryController.getSummary);

/**
 * @route   GET /api/summaries/user/:userId
 * @desc    Get all summaries for a user
 * @access  Public
 */
router.get('/user/:userId', summaryController.getUserSummaries);

/**
 * @route   GET /api/summaries/document/:documentId
 * @desc    Get all summaries for a document
 * @access  Public
 */
router.get('/document/:documentId', summaryController.getDocumentSummaries);

/**
 * @route   DELETE /api/summaries/:summaryId
 * @desc    Delete a summary
 * @access  Public
 */
router.delete('/:summaryId', summaryController.deleteSummary);

module.exports = router;

// Made with Bob
