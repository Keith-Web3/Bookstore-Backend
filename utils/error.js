class AppError extends Error {
  constructor(message, status, statusCode) {
    super(message)

    this.status = status
    this.statusCode = statusCode
    this.isOperational = true

    Error.captureStackTrace(this, this.constructor)
  }
}

module.exports = AppError
