import { IGDBID, IGDBSECRET } from "$env/static/private";
import { getIGDBAccessToken, getGameByID } from "$lib/igdb";

export async function load() {
    const accessToken = await getIGDBAccessToken();
    const gameData = await getGameByID(1029, accessToken)

    console.log({ gameData })
    return { gameData };
}