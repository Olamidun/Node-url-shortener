const redis = require('redis')

const client = redis.createClient()

const setUrlToCache = async(shortenedUrlData) =>{
    client.set('url', JSON.stringify(shortenedUrlData))
    return shortenedUrlData
}

const getCachedUrl = (key) =>{
    client.get(key, (err, data) =>{
        if (err){
            return {err}
        }
        if(data) {
            return JSON.parse(data)
        }
    })
}

module.exports = { setUrlToCache, getCachedUrl }