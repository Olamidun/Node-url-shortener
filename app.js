const express = require('express')
const shortenerRouter = require('./routes/shortener.routes')
const mongoose = require('mongoose')

const app = express()

// middleware used to recognize the incoming request as a JSON object.
app.use(express.json())

// middleware used to recognize the incoming request as strings or arrays.
app.use(express.urlencoded({extended: true }))


try{
    mongoose.connect('//mongodb://localhost:27017/nodecommerce', {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
        // mongodb+srv://8SgLP8Dhd1PJ3F21@@nodeecommerce.qmtrr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
    }catch(err){
        console.log(err);
    }


    app.use('api/shortener', shortenerRouter)

app.listen(5000, () =>{
    console.log('Server is running')
})