const storageService = require('../services/storage.service');
const { createResponse } = require('../utils/helpers');
const { HTTP_STATUS } = require('../utils/constants');

/**
 * User Controller
 * Handles user-related operations
 */

/**
 * Creates a new user
 */
const createUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existing = storageService.getUserByEmail(email);
    if (existing) {
      const error = new Error('An account with this email already exists');
      error.name = 'ValidationError';
      return next(error);
    }

    const user = storageService.createUser({ name, email, password });

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

/**
 * Logs in a user by email
 */
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      const error = new Error('Email and password are required');
      error.name = 'ValidationError';
      return next(error);
    }

    const userRaw = storageService.getUserByEmail(email);

    if (!userRaw || !storageService.verifyPassword(userRaw, password)) {
      const error = new Error('Invalid email or password');
      error.name = 'ValidationError';
      return next(error);
    }

    const { passwordHash: _, ...safeUser } = userRaw;
    res.status(HTTP_STATUS.OK).json(createResponse(true, safeUser));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createUser,
  loginUser,
  getUser,
  updateUser,
  getAllUsers
};

// Made with Bob
