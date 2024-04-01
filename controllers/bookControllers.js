const Book = require('../models/bookModel')
const APIFeatures = require('../utils/apiFeatures')
const catchAsync = require('../utils/catchAsync')

exports.createBook = catchAsync(async function (req, res) {
  const coverImgRes = await fetch(
    `https://api.unsplash.com/photos/random?query=${req.body.title.replace(
      ' ',
      '%20'
    )}%20cover&orientation=portrait&client_id=${process.env.UNSPLASH_CLIENT_ID}`
  )
  const { title, price, sales, description, status } = req.body
  const {
    urls: { full },
  } = await coverImgRes.json()
  const book = await Book.create({
    title,
    price,
    sales,
    description,
    status,
    author: req.user._id,
    coverImg: full,
  })

  res.status(201).json({
    status: 'success',
    data: book,
  })
})

exports.getBooks = catchAsync(async function (req, res) {
  let books = new APIFeatures(Book.find(), req.query).sort().field().paginate()

  const totalUnfiltered = await Book.countDocuments()

  const totalPages = Math.ceil(
    totalUnfiltered / (req.query.limit || totalUnfiltered)
  )

  books = await books.query

  res.status(200).json({
    status: 'success',
    count: books.length,
    data: { books, totalPages, totalBooks: totalUnfiltered },
  })
})

exports.getStats = catchAsync(async function (req, res) {
  const books = await Book.aggregate([
    {
      $match: { __v: 0 },
    },
    {
      $group: {
        _id: null,
        bookCount: { $sum: 1 },
        avgPrice: { $avg: '$price' },
        avgSales: { $avg: '$sales' },
      },
    },
  ])
  res.status(200).json({
    status: 'success',
    books: books,
  })
})

exports.clearDB = catchAsync(async function (req, res) {
  await Book.deleteMany()

  res.status(204).json({
    message: 'Cleared database successfully',
  })
})
