const redis = require('redis');

// const redisClient = async () => {
//   try {
//     const client = redis.createClient();
//     client.on('error', (err) => console.log('Redis Client Error', err));
//     await client.connect();

//     const deleteUrlFromCache = await client.del('url');

//     return { deleteUrlFromCache };
//   } catch (e) {
//     console.log(e);
//   }
// };

const client = redis.createClient(process.env.REDIS_URL);

const setUrlToCache = async (object) => {
  client.set('url', JSON.stringify(object));
  return object;
};

const getCachedUrl = async (key) => {
  client.get(key, (err, data) => {
    if (err) {
      return { err };
    }
    if (data) {
      const cachedData = JSON.parse(data);
      // console.log(cachedData)
      return cachedData;
    }
  });
};

const deleteUrlFromCache = async (key) => {
  client.del(key, (err, response) => {
    console.log(response);
  });
};

module.exports = { setUrlToCache, getCachedUrl, deleteUrlFromCache };
