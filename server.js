require('dotenv').config()
const passport = require('passport')
const express = require('express')
const mongoose = require('mongoose')
const userRoutes = require('./routes/user')
const listUser = require('./routes/listUser')
const postRoutes = require('./routes/post')


// express app
const app = express()

// middleware
app.use(express.json())

app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

// routes
app.use('/api/user', userRoutes)
app.use('/list',listUser)
app.use('/post',postRoutes )

app.use("/posts", express.static("public"));

require('./config/passport')(app);
// connect to db
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        // listen for requests
        app.listen(process.env.PORT, () => {
            console.log('connected to db & listening on port', process.env.PORT)
        })
    })
    .catch((error) => {
        console.log(error)
    })