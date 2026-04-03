const multer = require('multer');
const { MAX_FILE_SIZE, ALLOWED_FILE_TYPES, ERROR_CODES } = require('../utils/constants');

/**
 * Multer configuration for file uploads
 */

// Use memory storage for temporary file handling
const storage = multer.memoryStorage();

// File filter to validate file types
const fileFilter = (req, file, cb) => {
  if (ALLOWED_FILE_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Unsupported file type: ${file.mimetype}`), false);
  }
};

// Multer configuration
const upload = multer({
  storage: storage,
  limits: {
    fileSize: MAX_FILE_SIZE
  },
  fileFilter: fileFilter
});

module.exports = upload;

// Made with Bob
