const express = require('express')
const {createShortenedUrlController, loggedInUserUrlsController, singleUrlController, deleteUrlController, updateUrlController} = require('../controller/shortener.controller')
const { auth } = require('../utils/token')


const shortenerRouter = express.Router()

shortenerRouter.post('', auth, createShortenedUrlController)
shortenerRouter.get('', auth, loggedInUserUrlsController)
shortenerRouter.get('/:identifier', auth, singleUrlController)
shortenerRouter.delete('/:identifier', auth, deleteUrlController)
shortenerRouter.put('/:identifier', auth, updateUrlController)


module.exports = shortenerRouter