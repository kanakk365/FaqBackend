// redisClient.js
import { createClient } from 'redis';

const redisClient = createClient({
  url:  'redis://default:lsn9vxMRRo3BqEyv2ouKkE3YDKa9g2F5@redis-17980.c16.us-east-1-3.ec2.redns.redis-cloud.com:17980',
});

redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});

redisClient.on('connect', () => {
  console.log('Connected to Redis');
});


(async () => {
  await redisClient.connect();
})();

export default redisClient;