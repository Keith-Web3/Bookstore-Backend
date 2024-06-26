const app = require('./app')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const bookRoute = require('./routers/booksRoute')
const authRoute = require('./routers/authRoutes')
const userRoute = require('./routers/userRoutes')
const reviewsRoute = require('./routers/reviewRoutes')
const AppError = require('./utils/error')
const { handleError } = require('./controllers/errorControllers')

dotenv.config({ path: './env' })

const DB = process.env.DATABASE_URL.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
)

mongoose.connect(DB).then(con => {
  console.log('connected to server successfully')
})

app.use('/v1/books', bookRoute)
app.use('/v1/auth', authRoute)
app.use('/v1/users', userRoute)
app.use('/v1/reviews', reviewsRoute)

app.all('*', (req, res, next) => {
  const error = new AppError(
    'failed',
    404,
    `Could not find "${req.originalUrl}" page`
  )
  next(error)
})

app.use(handleError)
app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`)
})
