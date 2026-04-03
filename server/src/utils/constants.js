// Server constants
module.exports = {
  // Summary modes
  SUMMARY_MODES: {
    TLDR: 'tldr',
    DETAILED: 'detailed',
    BULLETS: 'bullets',
    ELI5: 'eli5'
  },

  // File upload limits
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB
  ALLOWED_FILE_TYPES: ['application/pdf', 'text/plain'],

  // Error codes
  ERROR_CODES: {
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    NOT_FOUND: 'NOT_FOUND',
    FILE_TOO_LARGE: 'FILE_TOO_LARGE',
    UNSUPPORTED_FILE_TYPE: 'UNSUPPORTED_FILE_TYPE',
    AI_SERVICE_ERROR: 'AI_SERVICE_ERROR',
    INTERNAL_ERROR: 'INTERNAL_ERROR'
  },

  // HTTP status codes
  HTTP_STATUS: {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    PAYLOAD_TOO_LARGE: 413,
    UNSUPPORTED_MEDIA_TYPE: 415,
    INTERNAL_SERVER_ERROR: 500,
    BAD_GATEWAY: 502
  }
};

// Made with Bob
