const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const Post = require('../models/Post');
const Category = require('../models/Category');
const { uploadImage } = require('../services/mediaService');

exports.getPosts = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const search = req.query.q;
  const category = req.query.category;
  const status = req.query.status || 'published';
  const sort = req.query.sort || '-createdAt';

  const query = {};

  if (status) {
    query.status = status;
  }

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { content: { $regex: search, $options: 'i' } },
      { excerpt: { $regex: search, $options: 'i' } },
    ];
  }

  if (category) {
    const categoryDoc = await Category.findOne({ slug: category }) || await Category.findById(category);
    if (categoryDoc) {
      query.categories = categoryDoc._id;
    }
  }

  const [total, posts] = await Promise.all([
    Post.countDocuments(query),
    Post.find(query)
      .populate('author', 'name avatar role')
      .populate('categories', 'name slug')
      .sort(sort)
      .skip(skip)
      .limit(limit),
  ]);

  res.json({
    success: true,
    data: posts,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit),
      limit,
    },
  });
});

exports.getPostById = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id)
    .populate('author', 'name avatar')
    .populate('categories', 'name slug');

  if (!post) {
    throw new ApiError(404, 'Post not found');
  }

  res.json({ success: true, data: post });
});

exports.getPostBySlug = asyncHandler(async (req, res) => {
  const post = await Post.findOne({ slug: req.params.slug })
    .populate('author', 'name avatar')
    .populate('categories', 'name slug');

  if (!post) {
    throw new ApiError(404, 'Post not found');
  }

  res.json({ success: true, data: post });
});

exports.createPost = asyncHandler(async (req, res) => {
  const payload = {
    ...req.body,
    author: req.user._id,
  };

  if (payload.categories) {
    payload.categories = Array.isArray(payload.categories) ? payload.categories : [payload.categories];
  }

  if (payload.tags) {
    payload.tags = Array.isArray(payload.tags) ? payload.tags : String(payload.tags).split(',').map((tag) => tag.trim()).filter(Boolean);
  }
  if (payload.price === '' || payload.price === null) {
    delete payload.price;
  }

  payload.featuredImage = (await uploadImage(req.file)) || req.body.featuredImage;

  if (payload.categories && payload.categories.length > 0) {
    const categories = await Category.find({ _id: { $in: payload.categories } });
    if (categories.length !== payload.categories.length) {
      throw new ApiError(400, 'One or more categories are invalid');
    }
  }

  const post = await Post.create(payload);

  const populated = await post.populate([
    { path: 'author', select: 'name avatar role' },
    { path: 'categories', select: 'name slug' },
  ]);

  res.status(201).json({ success: true, data: populated });
});

exports.updatePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    throw new ApiError(404, 'Post not found');
  }

  if (req.file) {
    req.body.featuredImage = await uploadImage(req.file);
  }

  if (req.body.categories) {
    req.body.categories = Array.isArray(req.body.categories) ? req.body.categories : [req.body.categories];
  }

  if (req.body.tags) {
    req.body.tags = Array.isArray(req.body.tags) ? req.body.tags : String(req.body.tags).split(',').map((tag) => tag.trim()).filter(Boolean);
  }
  if (req.body.price === '' || req.body.price === null) {
    delete req.body.price;
  }

  if (req.body.categories && req.body.categories.length > 0) {
    const categories = await Category.find({ _id: { $in: req.body.categories } });
    if (categories.length !== req.body.categories.length) {
      throw new ApiError(400, 'One or more categories are invalid');
    }
  }

  Object.assign(post, req.body);
  await post.save();
  const populated = await post.populate([
    { path: 'author', select: 'name avatar role' },
    { path: 'categories', select: 'name slug' },
  ]);

  res.json({ success: true, data: populated });
});

exports.deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    throw new ApiError(404, 'Post not found');
  }

  await post.deleteOne();
  res.status(204).send();
});

exports.toggleLike = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    throw new ApiError(404, 'Post not found');
  }

  const hasLiked = post.likes.some((like) => like.equals(req.user._id));
  if (hasLiked) {
    post.likes = post.likes.filter((like) => !like.equals(req.user._id));
  } else {
    post.likes.push(req.user._id);
  }

  await post.save();
  res.json({ success: true, data: post.likes });
});

