const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minLength: 10,
      maxLength: 60,
    },
    price: {
      type: Number,
      required: true,
    },
    sales: {
      type: Number,
      default: 0,
      min: 0,
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
