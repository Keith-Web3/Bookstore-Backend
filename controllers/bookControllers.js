const Book = require('../models/bookModel')

exports.createBook = async function (req, res) {
  try {
    const coverImgRes = await fetch(
      `https://api.unsplash.com/photos/random?query=cover&orientation=portrait&client_id=${process.env.UNSPLASH_CLIENT_ID}`
    )
    const {
      urls: { full },
    } = await coverImgRes.json()
    const book = await Book.create({ ...req.body, coverImg: full })

    res.status(201).json({
      status: 'success',
      data: { book: req.body },
    })
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    })
  }
}

exports.getBooks = async function (req, res) {
  try {
    const books = await Book.find()

    res.status(200).json({
      status: 'success',
      count: books.length,
      data: { books },
    })
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    })
  }
}

exports.clearDB = async function (req, res) {
  try {
    await Book.deleteMany()

    res.status(204).json({
      message: 'Cleared database successfully',
    })
  } catch (e) {
    res.status(500).json({
      err: err.message,
    })
  }
}
