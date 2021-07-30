const express = require('express')
const {createShortenedUrl, singleUrl} = require('../controller/shortener.controller')
const { auth } = require('../utils/token')


const shortenerRouter = express.Router()

shortenerRouter.post('', auth, createShortenedUrl)
shortenerRouter.get('/:identifier', singleUrl)

module.exports = shortenerRouter