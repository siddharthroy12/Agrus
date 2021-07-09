const path = require('path')
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const connectDB = require('./utils/connectDB')
const { notFound, errorHandler } = require('./middlewares/errorMiddlewares')
const userRoutes = require('./routes/userRoutes')

// Load environment variables from .env
require('dotenv').config()

// Connect to database
connectDB()

const app = express()
app.use(cors())

// Use logging in development mode
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}


app.use(express.json())
// app.use('/api/label', labelRoutes)
// app.use('/api/notes', noteRoutes)
app.use('/api/user', userRoutes)

// Serve build in production mode
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('frontend/build'))
  app.get('*', (req, res) => 
    res.sendFile(path.join(__dirname, '../', 'frontend', 'build', 'index.html'))
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