import IORedis from 'ioredis';
import Redlock from 'redlock';
import { serverConfig } from  './index';

export const redisClient = new IORedis(serverConfig.REDIS_URL);
export const redlock = new Redlock([redisClient], {
    driftFactor: 0.01,
    retryCount:  10,
    retryDelay:  200,
    retryJitter:  200
});
redisClient.on('connect', () => {
    console.log('Connected to Redis server');
});
redisClient.on('error', (err) => {
    console.error('Redis error:', err);
});
redisClient.on('close', () => {
    console.log('Redis connection closed');
});
redisClient.on('reconnecting', () => {
    console.log('Reconnecting to Redis server...');
});
redisClient.on('end', () => {
    console.log('Redis connection ended');
});
