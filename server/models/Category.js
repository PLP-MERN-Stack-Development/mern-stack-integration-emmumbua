const mongoose = require('mongoose');
const generateSlug = require('../utils/generateSlug');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

categorySchema.pre('save', function createSlug(next) {
  if (this.isModified('name')) {
    this.slug = generateSlug(this.name);
  }
  next();
});

module.exports = mongoose.model('Category', categorySchema);

