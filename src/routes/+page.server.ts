import { IGDBID, IGDBSECRET } from "$env/static/private";
import { getIGDBAccessToken, getGameByID, getCoverByID } from "$lib/igdb";
import { formatDate } from "$lib/utils";
import db from "$lib/db";
import { json } from "@sveltejs/kit";
import type { Game } from "$lib/types";

export async function load() {
    const accessToken = await getIGDBAccessToken();
    const gameData = await getGameByID(1029, accessToken)
    const coverURL = await getCoverByID(gameData[0].cover, accessToken)

    const gameAdd = db.prepare(
        `INSERT INTO games (name, release_date, genre, platforms, description, cover_art) 
         VALUES (?, ?, ?, ?, ?, ?)`
    );

    gameAdd.run(
        gameData[0].name,
        formatDate(gameData[0].first_release_date),
        JSON.stringify(gameData[0].genres),
        JSON.stringify(gameData[0].platforms),
        gameData[0].summary,
        coverURL
    );

    const dbGameData: Game[] = db.prepare('SELECT * FROM games').all() as Game[];
    return { dbGameData };

    // console.log(gameData[0].name)
    // return { gameData };
}