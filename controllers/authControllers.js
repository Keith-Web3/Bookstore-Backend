const jwt = require('jsonwebtoken')
const User = require('../models/userModel')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/error')
const { promisify } = require('util')
const sendEmail = require('../utils/email')
const crypto = require('crypto')

const signToken = function (userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  })
}

const sendJwtTokenViaCookies = function (token, res) {
  const cookieOptions = {
    expires: Date.now() + process.env.JWT_COOKIES_EXPIRES * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: true,
  }
  res.cookie('jwt', token, cookieOptions)
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

  user.password = null

  const token = signToken(user._id)
  sendJwtTokenViaCookies(token, res)

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
  sendJwtTokenViaCookies(token, res)

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

exports.forgotPassword = catchAsync(async function (req, res, next) {
  const { email } = req.body

  if (!email) return next(new AppError('Please provide a valid email', 400))

  const user = await User.findOne({ email })

  if (!user) return next(new AppError('This user does not exist', 404))

  const resetToken = user.createPasswordResetToken()
  await user.save({ validateBeforeSave: false })

  const emailOptions = {
    to: email,
    subject: 'Password Reset Request for Bookstore',
    message: `Hi ${user.name},

    We received a request to reset your password for your Bookstore account. To proceed with resetting your password, please click on the link below:
    
    ${req.protocol}://${req.get(
      'host'
    )}/api/v1/users/resetPassword/${resetToken}
    `,
  }

  try {
    await sendEmail(emailOptions)

    res.status(200).json({
      status: 'success',
      message: 'Sent password reset email',
    })
  } catch (err) {
    console.log(err)
    user.passwordResetToken = null
    user.resetTokenExpiresAt = null

    await user.save({ validateBeforeSave: false })

    return next(
      new AppError('There was an error sending the email. Try again later!'),
      500
    )
  }
})

exports.resetPassword = catchAsync(async function (req, res, next) {
  const { token } = req.params

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex')

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    resetTokenExpiresAt: { $gt: Date.now() },
  })

  if (!user)
    return next(new AppError('Password reset token invalid or expired', 401))

  user.password = req.body.password
  user.passwordConfirm = req.body.passwordConfirm
  user.passwordResetToken = null
  user.resetTokenExpiresAt = null

  await user.save()

  const jwtToken = signToken(user._id)
  sendJwtTokenViaCookies(jwtToken)

  res.status(200).json({
    status: 'success',
    message: 'Updated password successfully',
    token: jwtToken,
  })
})

exports.updatePassword = catchAsync(async function (req, res, next) {
  const user = await User.findById(req.user._id).select('+password')

  if (!user.confirmPassword(user.password, req.body.password)) {
    return next(new AppError('Incorrect password', 401))
  }

  user.password = req.body.newPassword
  user.passwordConfirm = req.body.passwordConfirm
  await user.save()

  const token = signToken(user._id)
  sendJwtTokenViaCookies(token, res)

  res.status(200).json({
    status: 'success',
    token,
    data: {
      user,
    },
  })
})
