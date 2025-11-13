const express = require('express');
const { body, param } = require('express-validator');
const { getCommentsForPost, createComment, deleteComment } = require('../controllers/commentController');
const validateRequest = require('../middleware/validateRequest');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router({ mergeParams: true });

router.get('/', [param('postId').isMongoId()], validateRequest, getCommentsForPost);

router.post(
  '/',
  protect,
  [
    param('postId').isMongoId(),
    body('content').notEmpty().withMessage('Content is required'),
    body('rating').optional().isInt({ min: 1, max: 5 }),
  ],
  validateRequest,
  createComment,
);

router.delete(
  '/:commentId',
  protect,
  [param('postId').isMongoId(), param('commentId').isMongoId()],
  validateRequest,
  deleteComment,
);

module.exports = router;

