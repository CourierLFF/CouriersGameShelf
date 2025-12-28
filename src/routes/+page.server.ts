import { IGDBID, IGDBSECRET } from "$env/static/private";
import { getIGDBAccessToken, getGameByID, getCoverByID } from "$lib/igdb";
import { formatDate } from "$lib/utils";
import db, { addGameToDB, getGamesFromDB } from "$lib/db";
import { json } from "@sveltejs/kit";
import type { Game } from "$lib/types";

export async function load() {
    const accessToken = await getIGDBAccessToken();
    addGameToDB(await getGameByID(185258, accessToken));

    const returnedGames = getGamesFromDB();
    return { returnedGames };

    // console.log(gameData[0].name)
    // return { gameData };
}