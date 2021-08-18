require('dotenv').config()
const express = require('express')
const shortenerRouter = require('./src/routes/shortener.routes')
const authRouter = require('./src/routes/auth.routes')
const mongoose = require('mongoose')

const app = express()

// middleware used to recognize the incoming request as a JSON object.
app.use(express.json())

// middleware used to recognize the incoming request as strings or arrays.
app.use(express.urlencoded({extended: false }))


try{
    mongoose.connect('//mongodb://localhost:27017/shrty', {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
    }catch(err){
        console.log(err);
    }

// Routes
app.use('/api/shortener', shortenerRouter)
app.use('/api/auth/', authRouter)

app.listen(5000, () =>{
    console.log('Server is running')
})


// middleware to respond to 404 errors
app.use((req, res) =>{
    res.status(404).send({
        error: true,
        message: "Resource cannot be found"
    })
})

module.exports = app // for testing