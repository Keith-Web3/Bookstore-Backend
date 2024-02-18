const app = require('./app')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const bookRoute = require('./routers/booksRoute')

dotenv.config({ path: './env' })

const DB = process.env.DATABASE_URL.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
)

mongoose.connect(DB).then(con => {
  console.log('connected to server successfully')
})

app.use('/v1/books', bookRoute)

app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`)
})
