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
            randomCharacters: randomCharacter(),
            owner: req.user._id
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
    try{
        const query = Url.where({randomCharacters: req.params.identifier})
        console.log(req.params.identifier)

        await query.findOne((err, url)=>{
            if (url) {
                res.status(200).json({
                    status: 'fetched',
                    url
                })
            }
        })
    } catch(err){
        res.json({
            err
        })
    }
}

const deleteUrl = async(req, res) =>{
    
    const url = await Url.findOne({randomCharacters: req.params.identifier})
    try{
        if (req.user._id == url.owner._id){
            url.delete()
            res.json({
                message: 'Url deleted!'
            })
        } else {
            res.send('You cannot access this url as you were not the one that shortened it')
        }
    } catch(err){
        res.json({
            err
        })
    }
    
}

module.exports = {
    createShortenedUrl,
    singleUrl, 
    deleteUrl
}
