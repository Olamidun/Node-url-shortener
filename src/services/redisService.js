const redis = require('redis');

const client = redis.createClient({
  host: 'ec2-34-236-230-40.compute-1.amazonaws.com',
  port: 8700,
  password: 'pf05602cc4bc02a1a3350c890d2cfb55ab45a27b1133a52b9153530da349c771e',
});

// redis://:pf05602cc4bc02a1a3350c890d2cfb55ab45a27b1133a52b9153530da349c771e@

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
