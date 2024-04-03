const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
  },
  email: {
    type: String,
    require: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  password: {
    type: String,
    require: [true, 'Please provide a password'],
    minlength: [8, 'Password must be longer than 8 characters'],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm password'],
    minlength: [8, 'Password must be longer than 8 characters'],
    validate: {
      validator: function (el) {
        return el === this.password
      },
      message: 'Passwords are not the same!',
    },
  },
  photo: String,
  passwordChangedAt: {
    type: Date,
    default: new Date(0),
    select: false,
  },
  passwordResetToken: String,
  resetTokenExpiresAt: Date,
  isActive: {
    type: Boolean,
    default: true,
    required: true,
    select: false,
  },
})

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()

  const hashedPassword = await bcrypt.hash(this.password, 12)

  this.password = hashedPassword
  this.passwordConfirm = null
  next()
})

userSchema.pre(/^find/, function (next) {
  // this points to the current query
  this.find({ isActive: { $ne: false } })
  next()
})

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next()

  this.passwordChangedAt = Date.now() - 1000
  next()
})

userSchema.methods.confirmPassword = async function (
  hashedPassword,
  inputPassword
) {
  return await bcrypt.compare(inputPassword, hashedPassword)
}

userSchema.methods.hasPasswordChanged = function (iat) {
  const changedDate = new Date(this.passwordChangedAt).getTime()

  return changedDate > +iat * 1000
}

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex')

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex')
  this.resetTokenExpiresAt = Date.now() + 10 * 60 * 1000

  return resetToken
}

const User = mongoose.model('User', userSchema)

module.exports = User
