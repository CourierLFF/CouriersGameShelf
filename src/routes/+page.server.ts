import { IGDBID, IGDBSECRET } from "$env/static/private";
import { getIGDBAccessToken, getGameByID, getCoverByID } from "$lib/igdb";
import { formatDate } from "$lib/utils";
import db, { addGameToDB } from "$lib/db";
import { json } from "@sveltejs/kit";
import type { Game } from "$lib/types";

export async function load() {
    const accessToken = await getIGDBAccessToken();
    addGameToDB(await getGameByID(185258, accessToken));

    const dbGameData: Game[] = db.prepare('SELECT * FROM games').all() as Game[];
    return { dbGameData };

    // console.log(gameData[0].name)
    // return { gameData };
}