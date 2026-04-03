const storageService = require('../services/storage.service');
const { createResponse, createErrorResponse } = require('../utils/helpers');
const { HTTP_STATUS, ERROR_CODES } = require('../utils/constants');

/**
 * User Controller
 * Handles user-related operations
 */

/**
 * Creates a new user
 */
const createUser = async (req, res, next) => {
  try {
    const { name, email } = req.body;

    // Create user
    const user = storageService.createUser({ name, email });

    res.status(HTTP_STATUS.CREATED).json(createResponse(true, user));
  } catch (error) {
    next(error);
  }
};

/**
 * Gets a user by ID
 */
const getUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = storageService.getUser(userId);

    if (!user) {
      const error = new Error('User not found');
      error.name = 'NotFoundError';
      return next(error);
    }

    res.status(HTTP_STATUS.OK).json(createResponse(true, user));
  } catch (error) {
    next(error);
  }
};

/**
 * Updates a user
 */
const updateUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const updates = req.body;

    const user = storageService.updateUser(userId, updates);

    if (!user) {
      const error = new Error('User not found');
      error.name = 'NotFoundError';
      return next(error);
    }

    res.status(HTTP_STATUS.OK).json(createResponse(true, user));
  } catch (error) {
    next(error);
  }
};

/**
 * Gets all users (for admin/debugging)
 */
const getAllUsers = async (req, res, next) => {
  try {
    const users = storageService.getAllUsers();
    res.status(HTTP_STATUS.OK).json(createResponse(true, users));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createUser,
  getUser,
  updateUser,
  getAllUsers
};

// Made with Bob
