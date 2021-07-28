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
    console.log(req.body.url)

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

const singleUrl = async(req, res) =>{
    const query = Url.where({randomCharacters: req.params.identifier})
    console.log(req.params.identifier)

    const shortenedUrl = await query.findOne((err, url)=>{
        if (url) {
            res.status(200).json({
                status: 'fetched',
                url
            })
        }
    })
    console.log(shortenedUrl.url)
}

module.exports = {
    createShortenedUrl,
    singleUrl
}
