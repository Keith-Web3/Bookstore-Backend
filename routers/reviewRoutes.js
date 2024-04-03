const express = require('express')
const {
  getAllReviews,
  createReview,
} = require('../controllers/reviewControllers')
const { protect } = require('../controllers/authControllers')

const router = express.Router({
  mergeParams: true,
})

router.route('/').get(getAllReviews).post(protect, createReview)

module.exports = router
