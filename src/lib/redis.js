import { REDIS_CONNECTION } from '$env/static/private';
import Redis from 'ioredis';

const redis = new Redis(REDIS_CONNECTION);

export default redis;