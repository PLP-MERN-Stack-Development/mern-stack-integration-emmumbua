const express = require('express');
const { body, param } = require('express-validator');
const {
  getPosts,
  getPostById,
  getPostBySlug,
  createPost,
  updatePost,
  deletePost,
  toggleLike,
} = require('../controllers/postController');
const validateRequest = require('../middleware/validateRequest');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router
  .route('/')
  .get(getPosts)
  .post(
    protect,
    authorize('admin', 'barista'),
    upload.single('featuredImage'),
    [
      body('title').notEmpty().withMessage('Title is required'),
      body('content').notEmpty().withMessage('Content is required'),
      body('status').optional().isIn(['draft', 'published']),
      body('categories').optional().isArray(),
      body('price').optional().isFloat({ min: 0 }),
    ],
    validateRequest,
    createPost,
  );

router.get('/slug/:slug', getPostBySlug);

router
  .route('/:id')
  .get(getPostById)
  .put(
    protect,
    authorize('admin', 'barista'),
    upload.single('featuredImage'),
    [
      param('id').isMongoId(),
      body('title').optional().isString(),
      body('content').optional().isString(),
      body('status').optional().isIn(['draft', 'published']),
      body('categories').optional().isArray(),
      body('price').optional().isFloat({ min: 0 }),
    ],
    validateRequest,
    updatePost,
  )
  .delete(
    protect,
    authorize('admin', 'barista'),
    [param('id').isMongoId()],
    validateRequest,
    deletePost,
  );

router.post('/:id/toggle-like', protect, [param('id').isMongoId()], validateRequest, toggleLike);

module.exports = router;

