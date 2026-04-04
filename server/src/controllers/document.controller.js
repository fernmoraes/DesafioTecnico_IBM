const storageService = require('../services/storage.service');
const fileParserService = require('../services/fileParser.service');
const { createResponse, createErrorResponse } = require('../utils/helpers');
const { HTTP_STATUS, ERROR_CODES } = require('../utils/constants');

/**
 * Document Controller
 * Handles document upload and processing
 */

/**
 * Uploads and processes a document
 */
const uploadDocument = async (req, res, next) => {
  try {
    const file = req.file;

    // Extract text from file
    let textContent;
    try {
      textContent = await fileParserService.extractText(file.buffer, file.mimetype);
    } catch (parseError) {
      const error = new Error(`Failed to parse file: ${parseError.message}`);
      error.name = 'FileParseError';
      return next(error);
    }

    // Validate extracted content
    if (!textContent || textContent.trim().length === 0) {
      const error = new Error('No text content could be extracted from the file');
      error.name = 'ValidationError';
      return next(error);
    }

    // Create document record
    const document = storageService.createDocument({
      userId: null,
      filename: file.originalname,
      fileType: file.mimetype,
      fileSize: file.size,
      textContent
    });

    // Return document info (without full text content for response size)
    const response = {
      id: document.id,
      userId: document.userId,
      filename: document.filename,
      fileType: document.fileType,
      fileSize: document.fileSize,
      uploadedAt: document.uploadedAt,
      textLength: textContent.length,
      textPreview: textContent.substring(0, 200) + (textContent.length > 200 ? '...' : '')
    };

    res.status(HTTP_STATUS.CREATED).json(createResponse(true, response));
  } catch (error) {
    next(error);
  }
};

/**
 * Gets a document by ID
 */
const getDocument = async (req, res, next) => {
  try {
    const { documentId } = req.params;

    const document = storageService.getDocument(documentId);

    if (!document) {
      const error = new Error('Document not found');
      error.name = 'NotFoundError';
      return next(error);
    }

    res.status(HTTP_STATUS.OK).json(createResponse(true, document));
  } catch (error) {
    next(error);
  }
};

/**
 * Gets all documents for a user
 */
const getUserDocuments = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const documents = storageService.getDocumentsByUser(userId);

    // Return documents without full text content
    const response = documents.map(doc => ({
      id: doc.id,
      userId: doc.userId,
      filename: doc.filename,
      fileType: doc.fileType,
      fileSize: doc.fileSize,
      uploadedAt: doc.uploadedAt,
      textLength: doc.textContent.length
    }));

    res.status(HTTP_STATUS.OK).json(createResponse(true, response));
  } catch (error) {
    next(error);
  }
};

/**
 * Deletes a document
 */
const deleteDocument = async (req, res, next) => {
  try {
    const { documentId } = req.params;

    const deleted = storageService.deleteDocument(documentId);

    if (!deleted) {
      const error = new Error('Document not found');
      error.name = 'NotFoundError';
      return next(error);
    }

    res.status(HTTP_STATUS.OK).json(createResponse(true, { 
      message: 'Document deleted successfully',
      documentId 
    }));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadDocument,
  getDocument,
  getUserDocuments,
  deleteDocument
};

// Made with Bob
