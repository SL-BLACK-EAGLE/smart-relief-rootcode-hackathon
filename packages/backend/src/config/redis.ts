import { createClient } from 'redis';

const url = process.env.REDIS_URL || 'redis://localhost:6379';

export const redis = createClient({ url });

redis.on('error', (err) => {
	// eslint-disable-next-line no-console
	console.error('Redis Client Error', err);
});

export const initRedis = async () => {
	if (!redis.isOpen) {
		await redis.connect();
	}
};

export default redis;

