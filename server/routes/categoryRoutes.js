const express = require('express');
const { body, param } = require('express-validator');
const { getCategories, createCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');
const validateRequest = require('../middleware/validateRequest');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getCategories);

router.post(
  '/',
  protect,
  authorize('admin', 'barista'),
  [body('name').notEmpty().withMessage('Name is required')],
  validateRequest,
  createCategory,
);

router.put(
  '/:id',
  protect,
  authorize('admin', 'barista'),
  [param('id').isMongoId()],
  validateRequest,
  updateCategory,
);

router.delete(
  '/:id',
  protect,
  authorize('admin'),
  [param('id').isMongoId()],
  validateRequest,
  deleteCategory,
);

module.exports = router;

