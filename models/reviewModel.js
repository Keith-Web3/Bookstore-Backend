const mongoose = require('mongoose')
const Book = require('./bookModel')

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

reviewSchema.index({ author: 1, book: 1 }, { unique: true })

reviewSchema.statics.calcAverageRating = async function (bookId) {
  const stats = await this.aggregate([
    { $match: { book: bookId } },
    {
      $group: {
        _id: '$book',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ])

  if (!stats[0]) {
    await Book.findByIdAndUpdate(bookId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    })
  } else {
    await Book.findByIdAndUpdate(bookId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    })
  }
}

reviewSchema.post('save', function () {
  this.constructor.calcAverageRating(this.book)
})
reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.clone().findOne()
  next()
})

reviewSchema.post(/^findOneAnd/, async function () {
  await this.r.constructor.calcAverageRating(this.r.book)
})

const Review = mongoose.model('Review', reviewSchema)

module.exports = Review
