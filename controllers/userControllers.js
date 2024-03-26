const User = require('../models/userModel')
const catchAsync = require('../utils/catchAsync')
const jwt = require('jsonwebtoken')
const AppError = require('../utils/error')
const { promisify } = require('util')

const signToken = function (userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  })
}

exports.signup = catchAsync(async function (req, res, next) {
  const { email, password } = req.body

  if (!email || !password) {
    return next(new AppError('Please provide a valid email and password', 400))
  }

  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
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

exports.login = catchAsync(async function (req, res, next) {
  const { email, password } = req.body

  if (!email || !password) {
    return next(new AppError('Please provide a valid email and password', 400))
  }

  const user = await User.findOne({ email }).select('+password')

  if (!user || !user.confirmPassword(user.password, password)) {
    return next(new AppError('Invalid email or password', 401))
  }

  const token = signToken(user._id)

  res.status(200).json({
    status: 'success',
    token,
  })
})

exports.protect = catchAsync(async function (req, res, next) {
  const authHeader = req.headers.authorization

  if (!authHeader?.startsWith('Bearer')) {
    return next(
      new AppError('You are not logged in, please login to access', 401)
    )
  }

  const token = authHeader.split(' ')[1]
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)

  const user = await User.findById(decoded.id)

  if (!user) {
    return next(
      new AppError('The user belonging to this token no longer exists', 404)
    )
  }
  if (user.hasPasswordChanged(decoded.iat)) {
    return next(
      new AppError('Password has changed, Please login again to access', 401)
    )
  }
  req.user = user
  next()
})
