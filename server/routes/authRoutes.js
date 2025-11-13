const express = require('express');
const { body } = require('express-validator');
const { register, login, logout, getProfile, updateProfile } = require('../controllers/authController');
const validateRequest = require('../middleware/validateRequest');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post(
  '/register',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  validateRequest,
  register,
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validateRequest,
  login,
);

router.post('/logout', protect, logout);
router.get('/me', protect, getProfile);
router.put(
  '/me',
  protect,
  [
    body('name').optional().isString(),
    body('email').optional().isEmail(),
    body('password').optional().isLength({ min: 6 }),
  ],
  validateRequest,
  updateProfile,
);

module.exports = router;

