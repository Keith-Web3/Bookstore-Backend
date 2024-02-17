const express = require('express')
const router = express.Router()

const {
  createBook,
  getBooks,
  clearDB,
} = require('../controllers/bookControllers')

router.route('/').get(getBooks).post(createBook).delete(clearDB)

module.exports = router
