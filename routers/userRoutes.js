const express = require('express')
const { protect } = require('../controllers/authControllers')
const {
  getMe,
  getAllUsers,
  deleteMe,
} = require('../controllers/userControllers')

const router = express.Router()

router.route('/').get(getAllUsers).delete(protect, deleteMe)

router.get('/current-user', protect, getMe)

module.exports = router
