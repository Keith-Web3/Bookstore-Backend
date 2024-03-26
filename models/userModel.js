const mongoose = require('mongoose')
const validator = require('validator')

const userSchema = mongoose.Schema({
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
})

const User = mongoose.model('User', userSchema)

exports.default = User
