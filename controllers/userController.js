const User = require('../models/userModel')
const catchAsync = require('../utils/catchAsync')
const jwt = require('jsonwebtoken')

const signToken = function (userId) {
  return jwt.sign(userId, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  })
}

exports.signup = catchAsync(async function (req, res, next) {
  const { email, password } = req.body

  if (!email || !password) {
    return next('Please provide a valid email and password')
  }

  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  })

  const token = signToken(user._id)

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user,
    },
  })
})
