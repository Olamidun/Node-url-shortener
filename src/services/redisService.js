const redis = require('redis');
const { promisify } = require('util');

const redisConf = {
  url: process.env.REDIS_URL,
};
const client = redis.createClient({
  url: redisConf.url,
});

try {
  client.getAsync = promisify(client.get).bind(client);
  client.setAsync = promisify(client.set).bind(client);
  client.delAsync = promisify(client.del).bind(client);
} catch (e) {
  console.log('redis error', e);
}

client.on('Connect', () => {
  console.log('Connected');
});

client.on('ready', () => {
  console.log('Connected to redis and ready for use');
});

client.on('error', (error) => {
  console.log(error.message);
});
// return { getUrlFromCache, deleteUrlFromCache, setUrlToCache };

// module.exports = redisAsyncFunction();

module.exports = client;

// const setUrlToCache = async (key, value) => {
//   return new Promise(resolve => {
//     client.set('url', value, (err, res) =>{
//       if (err) console.log(err);
//       resolve(res);
//     })
//   })
// };

// const getUrlFromCache = async(key) => {
//   return new Promise(resolve => {
//     client.get('url', (err, res) => {
//       if (err) console.log(err)
//       resolve(res)
//     })
//   })
// }

// const deleteUrlFromCache = async(key) => {
//   return new Promise(resolve => {
//     client.del('url', (err, res) => {
//       if(err) console.log(err)
//       resolve(res)
//     })
//   })
// }
