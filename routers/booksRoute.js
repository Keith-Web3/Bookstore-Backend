const express = require('express')
const router = express.Router()

const {
  createBook,
  getBooks,
  clearDB,
  getStats,
} = require('../controllers/bookControllers')
const { protect } = require('../controllers/authControllers')

router.route('/').get(protect, getBooks).post(createBook).delete(clearDB)
router.route('/stats').get(getStats)

module.exports = router
