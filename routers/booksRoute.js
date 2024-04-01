const express = require('express')
const router = express.Router()

const {
  createBook,
  getBooks,
  getStats,
} = require('../controllers/bookControllers')
const { protect } = require('../controllers/authControllers')

router.route('/').get(protect, getBooks).post(protect, createBook)
router.route('/stats').get(getStats)

module.exports = router
