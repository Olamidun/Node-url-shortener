const redis = require('redis');

// host: 'ec2-34-236-230-40.compute-1.amazonaws.com',
//   port: 8700,
//   password: 'pf05602cc4bc02a1a3350c890d2cfb55ab45a27b1133a52b9153530da349c771e',
// url: 'redis://:pf05602cc4bc02a1a3350c890d2cfb55ab45a27b1133a52b9153530da349c771e@ec2-34-236-230-40.compute-1.amazonaws.com:8700',

const client = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  pass: process.env.REDIS_PASSWORD,
});
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
