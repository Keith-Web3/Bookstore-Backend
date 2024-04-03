const express = require('express')
const {
  getAllReviews,
  createReview,
  deleteReview,
} = require('../controllers/reviewControllers')
const { protect } = require('../controllers/authControllers')

const router = express.Router({
  mergeParams: true,
})

router.route('/').get(getAllReviews).post(protect, createReview)
router.route('/:id').delete(protect, deleteReview)

module.exports = router
