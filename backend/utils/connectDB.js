const mongoose = require('mongoose')

// Connect to DB
const connectDB = async () => {
   try {
     const conn = await mongoose.connect(process.env.DB_URI, {
     	useUnifiedTopology: true,
     	useNewUrlParser: true,
     	useCreateIndex: true
     })
       console.log(`Database Connected: ${conn.connection.host}`)
   } catch (error) {
     console.error(`Error: ${error.message}`)
   }
}

module.exports = connectDB