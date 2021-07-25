const Url = require('../models/shortener')
const validator = require('validator')


const createShortenedUrl = async(req, res) =>{
    let randomCharacter = () =>{
        var result = [];
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';;
        for ( var i = 0; i < 4; i++ ) {
            result.push(characters.charAt(Math.floor(Math.random() * 
            characters.length)));
        }
        return result.join('')
    }
    const checkUrl = validator.isURL(req.body.url)

    if (checkUrl === true){
        const url = new Url({
            url: req.body.url,
            randomCharacters: randomCharacter()
        })
    
        const createdUrl = await url.save()
        res.status(201).json({
            status: 'created', createdUrl
        })
    } else {
        res.status(400).json({
            status: 'error', message: 'Invalid url'
        })
    }
}

module.exports = createShortenedUrl
