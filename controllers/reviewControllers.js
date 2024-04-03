const Review = require('../models/reviewModel')
const catchAsync = require('../utils/catchAsync')
const { filterObj } = require('../utils/filterObj')

exports.createReview = catchAsync(async function (req, res, next) {
  if (!req.body.book) req.body.book = req.params.bookId
  if (!req.body.author) req.body.book = req.user._id
  const requiredData = filterObj(req.body, 'review', 'rating', 'author', 'book')

  const review = await Review.create(requiredData)

  res.status(201).json({
    status: 'success',
    data: {
      review,
    },
  })
})

exports.getAllReviews = catchAsync(async function (req, res, next) {
  const reviews = await Review.find({ book: req.params.bookId })

  res.status(200).json({
    status: 'success',
    data: {
      reviews,
    },
  })
})

exports.getBookReviews
