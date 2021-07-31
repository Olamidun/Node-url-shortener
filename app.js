require('dotenv').config()
const express = require('express')
const shortenerRouter = require('./routes/shortener.routes')
const authRouter = require('./routes/auth.routes')
const mongoose = require('mongoose')

const app = express()

// middleware used to recognize the incoming request as a JSON object.
app.use(express.json())

// middleware used to recognize the incoming request as strings or arrays.
app.use(express.urlencoded({extended: false }))


try{
    mongoose.connect('//mongodb://localhost:27017/shrty', {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
        // mongodb+srv://8SgLP8Dhd1PJ3F21@@nodeecommerce.qmtrr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
    }catch(err){
        console.log(err);
    }

// Routes
app.use('/api/shortener', shortenerRouter)
app.use('/api/auth/', authRouter)

app.listen(5000, () =>{
    console.log('Server is running')
})