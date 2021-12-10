const redis = require('redis');

const redisConf = {
  host: 'ec2-54-161-13-227.compute-1.amazonaws.com',
  port: 8980,
  pass: 'p866296af92e979de3e5e2f7fc1249840fc2ec4e0d818fa65384ece1974d9307a',
};

const client = redis.createClient();
// client.connect();

module.exports = client;
