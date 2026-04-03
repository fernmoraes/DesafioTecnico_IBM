const { ERROR_CODES, HTTP_STATUS } = require('../utils/constants');
const { createErrorResponse } = require('../utils/helpers');

/**
 * Global error handling middleware
 */
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Multer file size error
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(HTTP_STATUS.PAYLOAD_TOO_LARGE).json(
      createErrorResponse(
        ERROR_CODES.FILE_TOO_LARGE,
        'File size exceeds maximum limit of 5MB'
      )
    );
  }

  // Multer file type error
  if (err.message && err.message.includes('Unsupported file type')) {
    return res.status(HTTP_STATUS.UNSUPPORTED_MEDIA_TYPE).json(
      createErrorResponse(
        ERROR_CODES.UNSUPPORTED_FILE_TYPE,
        'Only PDF and TXT files are supported'
      )
    );
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    return res.status(HTTP_STATUS.BAD_REQUEST).json(
      createErrorResponse(
        ERROR_CODES.VALIDATION_ERROR,
        err.message,
        err.details
      )
    );
  }

  // Not found errors
  if (err.name === 'NotFoundError') {
    return res.status(HTTP_STATUS.NOT_FOUND).json(
      createErrorResponse(
        ERROR_CODES.NOT_FOUND,
        err.message
      )
    );
  }

  // AI service errors
  if (err.name === 'AIServiceError') {
    return res.status(HTTP_STATUS.BAD_GATEWAY).json(
      createErrorResponse(
        ERROR_CODES.AI_SERVICE_ERROR,
        'Failed to generate summary. Please try again.',
        process.env.NODE_ENV === 'development' ? err.message : undefined
      )
    );
  }

  // Default internal server error
  return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
    createErrorResponse(
      ERROR_CODES.INTERNAL_ERROR,
      'An unexpected error occurred',
      process.env.NODE_ENV === 'development' ? err.message : undefined
    )
  );
};

module.exports = errorHandler;

// Made with Bob
