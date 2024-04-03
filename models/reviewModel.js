const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Please provide a review'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, 'Please provide a rating'],
    },
    author: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Every review must have an author'],
    },
    book: {
      type: mongoose.Schema.ObjectId,
      ref: 'Book',
      required: [true, 'Every review must belong to a book'],
    },
  },
  { timestamps: true }
)

const Review = mongoose.model('Review', reviewSchema)

module.exports = Review
