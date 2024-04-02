const express = require('express')
const router = express.Router()

const {
  createBook,
  getBooks,
  getStats,
  getBook,
} = require('../controllers/bookControllers')
const { protect } = require('../controllers/authControllers')

router.route('/').get(getBooks).post(protect, createBook)
router.route('/:id').get(getBook)
router.route('/stats').get(getStats)

module.exports = router
