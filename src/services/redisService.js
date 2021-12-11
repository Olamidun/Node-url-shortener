const redis = require('redis');

module.exports = () => {
  const redisConf = {
    url: process.env.REDIS_URL,
  };

  const client = redis.createClient({
    url: redisConf.url,
  });

  client.on('Connect', () => {
    console.log('Connected');
  });

  client.on('ready', () => {
    console.log('Connected to redis and ready for use');
  });

  client.on('error', (error) => {
    console.log(error.message);
  });

  return client;
};
