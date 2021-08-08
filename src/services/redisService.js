const redis = require('redis')

const client = redis.createClient()

const setUrlToCache = async(object) =>{
    client.set('url', JSON.stringify(object))
    return object
}

const getCachedUrl = async (key) =>{
    client.get(key, (err, data) =>{
        if (err){
            return{err}
        }
        if(data) {
            cachedData = JSON.parse(data)
            // console.log(cachedData)
            return cachedData
        }
    })
}

const deleteUrlFromCache = async (key) =>{
    client.del(key, (err, response)=>{
        console.log(response)
    })
}

module.exports = { setUrlToCache, getCachedUrl, deleteUrlFromCache }