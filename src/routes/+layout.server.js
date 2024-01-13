import { getAllMp3Urls } from "$lib/aws";

export const prerender = true;
export function load() {
    let mp3Urls = getAllMp3Urls();
    return {
        mp3Urls: mp3Urls
    };
}
