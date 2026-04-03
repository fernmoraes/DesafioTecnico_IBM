const express = require('express');
const router = express.Router();
const documentController = require('../controllers/document.controller');
const { validateRequest } = require('../middleware/validateRequest');
const { upload } = require('../config/multer.config');

/**
 * Document Routes
 * Base path: /api/documents
 */

/**
 * @route   POST /api/documents/upload
 * @desc    Upload and process a document
 * @access  Public
 */
router.post(
  '/upload',
  upload.single('file'),
  validateRequest({
    body: {
      userId: { type: 'string', required: true }
    }
  }),
  documentController.uploadDocument
);

/**
 * @route   GET /api/documents/:documentId
 * @desc    Get a document by ID
 * @access  Public
 */
router.get(
  '/:documentId',
  validateRequest({
    params: {
      documentId: { type: 'string', required: true }
    }
  }),
  documentController.getDocument
);

/**
 * @route   GET /api/documents/user/:userId
 * @desc    Get all documents for a user
 * @access  Public
 */
router.get(
  '/user/:userId',
  validateRequest({
    params: {
      userId: { type: 'string', required: true }
    }
  }),
  documentController.getUserDocuments
);

/**
 * @route   DELETE /api/documents/:documentId
 * @desc    Delete a document
 * @access  Public
 */
router.delete(
  '/:documentId',
  validateRequest({
    params: {
      documentId: { type: 'string', required: true }
    }
  }),
  documentController.deleteDocument
);

module.exports = router;

// Made with Bob
