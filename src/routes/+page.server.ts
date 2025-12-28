import { IGDBID, IGDBSECRET } from "$env/static/private";
import { getIGDBAccessToken, getGameByID, getCoverByID } from "$lib/igdb";
import { formatDate } from "$lib/utils";
import db, { addGameToDB, getGamesFromDB } from "$lib/db";
import { fail, json, type Actions } from "@sveltejs/kit";
import type { Game } from "$lib/types";

export async function load() {
    const returnedGames = getGamesFromDB();
    return { returnedGames };

    // console.log(gameData[0].name)
    // return { gameData };
}

export const actions: Actions = {
    default: async ({ request }) => {
        const data = await request.formData();

        const gameID = Number(data.get('add-game'));
        if (Number.isNaN(gameID)) {
            return fail(400, { error: true, message: 'Invalid game ID' });
        }

        const accessToken = await getIGDBAccessToken();
        const result = addGameToDB(await getGameByID(gameID, accessToken));
        console.log(result);
    }
};