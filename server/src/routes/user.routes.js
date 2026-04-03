const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { validateRequest } = require('../middleware/validateRequest');

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
  validateRequest({
    body: {
      name: { type: 'string', required: true, minLength: 2, maxLength: 100 },
      email: { type: 'string', required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ }
    }
  }),
  userController.createUser
);

/**
 * @route   GET /api/users/:userId
 * @desc    Get a user by ID
 * @access  Public
 */
router.get(
  '/:userId',
  validateRequest({
    params: {
      userId: { type: 'string', required: true }
    }
  }),
  userController.getUser
);

/**
 * @route   PUT /api/users/:userId
 * @desc    Update a user
 * @access  Public
 */
router.put(
  '/:userId',
  validateRequest({
    params: {
      userId: { type: 'string', required: true }
    },
    body: {
      name: { type: 'string', required: false, minLength: 2, maxLength: 100 },
      email: { type: 'string', required: false, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ }
    }
  }),
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
