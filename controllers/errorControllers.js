exports.handleError = function (err, req, res, next) {
  console.log(err.keyValue)
  const errorName = err.constructor.name

  if (errorName === 'TokenExpiredError') {
    err.message = 'User session expired, please login again.'
  }
  if (errorName === 'JsonWebTokenError') {
    err.message = 'Authentication failed, please login again.'
  }
  if (err.code === 11000 && err.keyValue?.has('email')) {
    err.message = 'User with this email already exists.'
  }
  const errorObj =
    process.env.NODE_ENV === 'development'
      ? {
          status: err.status,
          message: err.message,
          stack: err.stack,
        }
      : {
          status: err.status,
          message: err.message,
        }

  res.status(err.statusCode || 500).json(errorObj)
}
