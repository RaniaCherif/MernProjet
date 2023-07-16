const express = require('express')
require('dotenv').config({path: './config/.env'})
require('./config/db')
const app = express()
app.use(express.json())


//routes

app.use('/api/user', require('./routes/userRoutes'))
app.use('/api/post', require('./routes/postRoutes'))

//server

app.listen(process.env.PORT, (err) => {
  err ? console.log(err) : console.log(` server is running on http://localhost: ${process.env.PORT}`)
});
