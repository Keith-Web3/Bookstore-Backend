const express = require('express')
const helmet = require('helmet')
const xss = require('xss-clean')
const limiter = require('express-rate-limit')
const sanitize = require('express-mongo-sanitize')

const app = express()

app.use(helmet())

app.use(express.json())
app.use(sanitize())

app.use(xss())

const limit = limiter.rateLimit({
  max: 20,
  windowMs: 30 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in 30 minutes',
})

app.use('/v1/auth', limit)

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  next()
})

module.exports = app
