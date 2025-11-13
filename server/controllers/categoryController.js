const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const Category = require('../models/Category');

exports.getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort('name');
  res.json({ success: true, data: categories });
});

exports.createCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  const existing = await Category.findOne({ name });
  if (existing) {
    throw new ApiError(400, 'Category already exists');
  }

  const category = await Category.create({ name, description });
  res.status(201).json({ success: true, data: category });
});

exports.updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    throw new ApiError(404, 'Category not found');
  }

  category.name = req.body.name ?? category.name;
  category.description = req.body.description ?? category.description;

  await category.save();

  res.json({ success: true, data: category });
});

exports.deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    throw new ApiError(404, 'Category not found');
  }

  await category.deleteOne();
  res.status(204).send();
});

