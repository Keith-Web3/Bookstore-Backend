const express = require('express')
const router = express.Router()

const {
  createBook,
  getBooks,
  clearDB,
  getStats,
} = require('../controllers/bookControllers')

router.route('/').get(getBooks).post(createBook).delete(clearDB)
router.route('/stats').get(getStats)

module.exports = router
