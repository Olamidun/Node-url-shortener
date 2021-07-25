const Url = require('../models/shortener')


const createShortenedUrl = async(req, res) =>{
    const url = new Url({
        url: req.body.url
    })

    const createdUrl = await Url.save()
    res.status(201).json({
        status: 'created', createdUrl
    })
}

module.exports = {
    createShortenedUrl
}