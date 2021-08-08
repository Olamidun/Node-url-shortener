const Url = require('../models/shortener')
const validator = require('validator')
const { deleteUrlFromCache } = require('../services/redisService')

const redis = require('redis')

const client = redis.createClient()



const createShortenedUrlController = async(req, res) =>{
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
            randomCharacters: randomCharacter(),
            owner: req.user._id
        })
    
        const createdUrl = await url.save()
        await deleteUrlFromCache('url')
        res.status(201).json({
            status: 'created', createdUrl
        })
    } else {
        res.status(400).json({
            status: 'error', message: 'Invalid url'
        })
    }
}

const loggedInUserUrlsController = async(req, res) =>{
    const url = await Url.find({owner: req.user._id})
    numberOfUrl = await Url.find({owner: req.user._id}).countDocuments({}, (err, count) =>{
        if (err) {
            return err
        }else {
            return count
        }
    })
    try{
        client.get('url', (err, data) =>{
            if (err){
                return {err}
            }
            if(data) {
                
                res.status(200).send(JSON.parse(data))
            } else {
                client.set('url', JSON.stringify({url, numberOfUrl}))
                res.status(200).json({url, numberOfUrl})
            }
        })
    }catch(err){
        res.status(500).send({error: err.message})
    }
}

const singleUrlController = async(req, res) =>{
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

const deleteUrlController = async(req, res) =>{
    
    const url = await Url.findOne({randomCharacters: req.params.identifier})
    try{
        if (req.user._id == url.owner._id){
            await url.delete()
            await deleteUrlFromCache('url')
            res.json({
                message: 'Url deleted!'
            })
        } else {
            res.status(401).json({error: 'You cannot access this url as you were not the one that shortened it'})
        }
    } catch(err){
        res.json({
            err
        })
    }
    
}

const updateUrlController = async(req, res) =>{
    const url = await Url.findOne({
        randomCharacters: req.params.identifier
    })
    console.log(url)

    if (req.user._id == url.owner._id){
        url.url = req.body.url
        await url.save()
        await deleteUrlFromCache('url')
        res.json({
            message: 'Url has been updated successfully',
            url: url.url
        })
    } else {
        res.status(401).json({error: 'You cannot access this url as you were not the one that shortened it'})
    }
}

module.exports = {
    createShortenedUrlController,
    loggedInUserUrlsController,
    singleUrlController, 
    deleteUrlController,
    updateUrlController
}
