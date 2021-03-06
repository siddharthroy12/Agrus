// Load environment variables from .env (This line should be at toop!)
require('dotenv').config()

const path = require('path')
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const connectDB = require('./utils/connectDB')
const { notFound, errorHandler } = require('./middlewares/errorMiddlewares')
const userRoutes = require('./routes/userRoutes')
const boardRoutes = require('./routes/boardRoutes')
const postRoutes = require('./routes/postRoutes')
const uploadRoute = require('./routes/uploadRoute')
const commentRoute = require('./routes/commentRoutes')

// Connect to database
connectDB()

const app = express()
app.use(cors())

// Use logging in development mode
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

app.use(express.json())
app.use('/api/user', userRoutes)
app.use('/api/board', boardRoutes)
app.use('/api/post', postRoutes)
app.use('/api/upload', uploadRoute)
app.use('/api/comment', commentRoute)

// Serve client in production mode
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'))
  app.get('*', (req, res) => 
    res.sendFile(path.join(__dirname, '../', 'client', 'build', 'index.html'))
  )
} else {
  app.get('/', (req, res) => {
    res.send('API Server is running...')
  })
}

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`))