const mongoose = require('mongoose');
const generateSlug = require('../utils/generateSlug');

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    excerpt: {
      type: String,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      default: 0,
    },
    featuredImage: {
      type: String,
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
      },
    ],
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    isFeatured: {
      type: Boolean,
      default: false,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    ratings: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        value: { type: Number, min: 1, max: 5 },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

postSchema.virtual('averageRating').get(function average() {
  if (!this.ratings || this.ratings.length === 0) {
    return null;
  }
  const total = this.ratings.reduce((acc, rating) => acc + rating.value, 0);
  return Math.round((total / this.ratings.length) * 10) / 10;
});

postSchema.pre('save', function createSlug(next) {
  if (this.isModified('title')) {
    this.slug = generateSlug(this.title);
  }
  next();
});

module.exports = mongoose.model('Post', postSchema);

