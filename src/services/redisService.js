const redis = require('redis');

const redisConf = {
  host: 'ec2-54-161-13-227.compute-1.amazonaws.com',
  port: 8980,
  pass: 'p866296af92e979de3e5e2f7fc1249840fc2ec4e0d818fa65384ece1974d9307a',
};

const client = redis.createClient(redisConf);
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
