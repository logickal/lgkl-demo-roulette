import Redis from 'ioredis';

let redis = new Redis();

export async function POST(event) {
    console.log('get user data called');
    const body = await event.request.json();
    let username = body.username;
    let userData = await redis.get(username);
    console.log(userData);
    return new Response(userData);
}
