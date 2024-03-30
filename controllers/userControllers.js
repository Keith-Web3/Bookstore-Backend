const User = require('../models/userModel')
const catchAsync = require('../utils/catchAsync')

exports.getMe = catchAsync(async function (req, res, next) {
  const user = req.user

  res.status(200).json({
    status: 'success',
    data: { user },
  })
})

exports.deleteMe = catchAsync(async function (req, res, next) {
  const user = req.user
  user.isActive = false

  await user.save({ validateBeforeSave: false })

  res.status(200).json({
    status: 'success',
  })
})
