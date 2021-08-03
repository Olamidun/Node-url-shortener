const express = require('express')
const {createShortenedUrl, loggedInUserUrls, singleUrl, deleteUrl, updateUrl, sendEmailEndpoint} = require('../controller/shortener.controller')
const { auth } = require('../utils/token')


const shortenerRouter = express.Router()

shortenerRouter.post('', auth, createShortenedUrl)
shortenerRouter.get('', auth, loggedInUserUrls)
shortenerRouter.get('/:identifier', singleUrl)
shortenerRouter.delete('/:identifier', auth, deleteUrl)
shortenerRouter.patch('/:identifier', auth, updateUrl)
shortenerRouter.post('/sendEmail', sendEmailEndpoint)

module.exports = shortenerRouter