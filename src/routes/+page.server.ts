import { IGDBID, IGDBSECRET } from "$env/static/private";
import { getIGDBAccessToken } from "$lib/igdb";

export async function load() {
    const accessToken = await getIGDBAccessToken();
    console.log(accessToken);
}