import redis from '$lib/redis';
import { json } from '@sveltejs/kit';

export async function POST(event) {
    const body = await event.request.json();
    let username = body.username;
    let userData = await redis.get(username);
    return json(userData);
}
