const express = require('express')
const { createShortenedUrl } = require('../controller/shortener.controller')

const authRouter = express.Router()

authRouter.post('/register', (req, res) =>{
    res.send(
        'Register'
    )
})

authRouter.post('/login', (req, res) =>{
    res.send('Logged in')
})

module.exports = authRouter