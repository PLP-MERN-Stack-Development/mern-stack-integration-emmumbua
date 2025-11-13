const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const Comment = require('../models/Comment');
const Post = require('../models/Post');

exports.getCommentsForPost = asyncHandler(async (req, res) => {
  const comments = await Comment.find({ post: req.params.postId })
    .populate('author', 'name avatar')
    .sort('-createdAt');

  res.json({ success: true, data: comments });
});

exports.createComment = asyncHandler(async (req, res) => {
  const { content, rating } = req.body;

  const post = await Post.findById(req.params.postId);
  if (!post) {
    throw new ApiError(404, 'Post not found');
  }

  const comment = await Comment.create({
    post: req.params.postId,
    author: req.user._id,
    content,
    rating,
  });

  if (rating) {
    const existingRatingIndex = post.ratings.findIndex((item) => item.user.equals(req.user._id));
    if (existingRatingIndex > -1) {
      post.ratings[existingRatingIndex].value = rating;
    } else {
      post.ratings.push({ user: req.user._id, value: rating });
    }
    await post.save();
  }

  const populated = await comment.populate('author', 'name avatar');
  res.status(201).json({ success: true, data: populated });
});

exports.deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.commentId);
  if (!comment) {
    throw new ApiError(404, 'Comment not found');
  }

  if (!comment.author.equals(req.user._id) && req.user.role !== 'admin') {
    throw new ApiError(403, 'Not authorized to delete this comment');
  }

  await comment.deleteOne();
  res.status(204).send();
});

