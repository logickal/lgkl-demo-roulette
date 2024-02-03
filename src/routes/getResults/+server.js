import redis from '$lib/redis';
import { json } from '@sveltejs/kit';

export async function GET() {
    const keys = await redis.keys('*');
    const results = {};

    for (const key of keys) {
        const value = await redis.get(key);
        results[key] = value;
    }

    return json(results);
}