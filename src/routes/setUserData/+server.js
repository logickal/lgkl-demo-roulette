import Redis from 'ioredis';

let redis = new Redis();

export async function POST(event) {
    const body = await event.request.json();
    console.log(body);
    let { username, songRatings} = body;
    try { 
        redis.set(username, JSON.stringify(songRatings));
        return new Response('success');
    }
    catch(err) {
        console.log(err);
        return new Response('error');
    }
}