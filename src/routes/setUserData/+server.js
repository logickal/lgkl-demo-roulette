import redis from '$lib/redis';

export async function POST(event) {
    const body = await event.request.json();
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