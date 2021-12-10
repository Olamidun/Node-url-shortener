const redis = require('redis');

const client = redis.createClient(process.env.REDIS_URL);
client.connect();

client.on('Connect', () => {
  console.log('Connected');
});

client.on('ready', () => {
  console.log('Connected to redis and ready for use');
});

client.on('error', (error) => {
  console.log(error.message);
});

client.on('end', () => {
  console.log('Redis has been disconnected');
});

process.on('SIGINT', () => {
  client.quit();
});

module.exports = client;
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

// const client = redis.createClient(process.env.REDIS_URL);

// const setUrlToCache = async (object) => {
//   client.set('url', JSON.stringify(object));
//   return object;
// };

// const getCachedUrl = async (key) => {
//   client.get(key, (err, data) => {
//     if (err) {
//       return { err };
//     }
//     if (data) {
//       const cachedData = JSON.parse(data);
//       // console.log(cachedData)
//       return cachedData;
//     }
//   });
// };

// const deleteUrlFromCache = async (key) => {
//   client.del(key, (err, response) => {
//     console.log(response);
//   });
// };

module.exports = client;
