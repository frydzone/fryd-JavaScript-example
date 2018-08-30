/**
 * Start the Redis client.
 */
var Redis = require('ioredis');
var redis = new Redis(
  process.env.REDIS,
  {
    db: 10,
  }
);

/**
 * Make the client accessible to the public
 */
module.exports = redis;
