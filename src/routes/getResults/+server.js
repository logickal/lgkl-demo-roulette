import redis from '$lib/redis';
import { json } from '@sveltejs/kit';

export async function GET() {
    const keys = await redis.keys('*');
    let songData = {};

    for (const key of keys) {
        const value = await redis.get(key);

        for (let song in value) {
            if (!songData[song]) {
                songData[song] = { ratings: [], notes: [], avgRating: 0 };
            }
            songData[song].ratings.push(value[song].rating);
            songData[song].notes.push(value[song].notes);
            songData[song].avgRating = songData[song].ratings.reduce((a, b) => a + b, 0) / songData[song].ratings.length;
        }
    }

    songData = Object.entries(songData).sort((a, b) => b[1].avgRating - a[1].avgRating).reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});

    return json(songData);
}