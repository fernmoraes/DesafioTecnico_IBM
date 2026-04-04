const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { validateUserCreation } = require('../middleware/validateRequest');

/**
 * User Routes
 * Base path: /api/users
 */

/**
 * @route   POST /api/users
 * @desc    Create a new user
 * @access  Public
 */
router.post(
  '/',
  validateUserCreation,
  userController.createUser
);

/**
 * @route   GET /api/users/:userId
 * @desc    Get a user by ID
 * @access  Public
 */
router.get(
  '/:userId',
  userController.getUser
);

/**
 * @route   PUT /api/users/:userId
 * @desc    Update a user
 * @access  Public
 */
router.put(
  '/:userId',
  userController.updateUser
);

/**
 * @route   GET /api/users
 * @desc    Get all users (for debugging)
 * @access  Public
 */
router.get('/', userController.getAllUsers);

module.exports = router;

// Made with Bob
