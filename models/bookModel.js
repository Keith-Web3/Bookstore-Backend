const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minLength: 10,
      maxLength: 60,
    },
    author: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    price: {
      type: Number,
      required: true,
      min: [0, 'Price cannot be less than 0'],
    },
    sales: {
      type: Number,
      default: 0,
      min: 0,
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: val => Math.round(val * 10) / 10, // 4.666666, 46.6666, 47, 4.7
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ['draft', 'published'],
        message: '{VALUE} is an invalid status type',
      },
    },
    coverImg: {
      type: String,
      required: true,
    },
  },

  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
)

bookSchema.virtual('revenue').get(function () {
  return this.price * this.sales
})

const Book = mongoose.model('Book', bookSchema)

module.exports = Book
