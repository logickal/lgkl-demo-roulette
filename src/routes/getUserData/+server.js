import redis from '$lib/redis';
import { json } from '@sveltejs/kit';

export async function POST(event) {
    console.log('get user data called');
    const body = await event.request.json();
    let username = body.username;
    console.log('Requesting data for ' + username);
    let userData = await redis.get(username);
    console.log(userData);
    return json(userData);
}
