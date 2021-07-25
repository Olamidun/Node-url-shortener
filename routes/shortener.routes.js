const express = require('express')
const createShortenedUrl = require('../controller/shortener.controller')


const shortenerRouter = express.Router()

shortenerRouter.post('', createShortenedUrl)

module.exports = shortenerRouter