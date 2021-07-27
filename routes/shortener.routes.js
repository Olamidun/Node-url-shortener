const express = require('express')
const {createShortenedUrl, singleUrl} = require('../controller/shortener.controller')


const shortenerRouter = express.Router()

shortenerRouter.post('', createShortenedUrl)
shortenerRouter.get('/:identifier', singleUrl)

module.exports = shortenerRouter