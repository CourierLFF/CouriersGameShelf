import { IGDBID, IGDBSECRET } from "$env/static/private";
import { getIGDBAccessToken, getGameByID, getCoverByID, searchGamesByName } from "$lib/igdb";
import { formatDate } from "$lib/utils";
import db, { addGameToDB, changeGameStateInDB, getGamesFromDB, removeGameFromDB } from "$lib/db";
import { fail, json, type Actions } from "@sveltejs/kit";
import type { Game } from "$lib/types";

export async function load() {
    const returnedGames = getGamesFromDB();
    return { returnedGames };

    // console.log(gameData[0].name)
    // return { gameData };
}

export const actions: Actions = {
    addGame: async ({ request }) => {
        const data = await request.formData();

        const gameID = Number(data.get('add-game'));
        if (Number.isNaN(gameID)) {
            return fail(400, { error: true, message: 'Invalid game ID' });
        }

        const gameState = String(data.get('game-state'));
        if (!['Playing', 'Backlog', 'Completed', 'Dropped'].includes(gameState)) {
            return fail(400, { error: true, message: 'Invalid game state' });
        }

        let userRating = Number(data.get('user-rating'));
        if (Number.isNaN(userRating) || userRating < 0 || userRating > 100) {
            return fail(400, { error: true, message: 'Invalid user rating' });
        }

        const accessToken = await getIGDBAccessToken();
        const gameResponse = await getGameByID(gameID, accessToken);

        if (gameResponse.error) {
            return fail(400, { error: true, message: gameResponse.message });
        }

        const result = addGameToDB(gameResponse.data, gameState, userRating);

        if (result.error) {
            return fail(400, result);
        }
        
        return result;
    },
    removeGame: async ({ request }) => {
        const data = await request.formData();

        const gameID = Number(data.get('remove-game'));
        if (Number.isNaN(gameID)) {
            return fail(400, { error: true, message: 'Invalid game ID' });
        }

        const result = removeGameFromDB(gameID);
        return result;
    },
    updateGameState: async ({ request }) => {
        const data = await request.formData();

        const gameID = Number(data.get('updated-game'));
        if (Number.isNaN(gameID)) {
            return fail(400, { error: true, message: 'Invalid game ID' });
        }

        const newGameState = String(data.get('new-game-state'));
        if (!['Playing', 'Backlog', 'Completed', 'Dropped'].includes(newGameState)) {
            return fail(400, { error: true, message: 'Invalid game state' });
        }

        const result = changeGameStateInDB(gameID, newGameState);
        return result;
    },
    searchGame: async ({ request }) => {
        const data = await request.formData();

        const query = String(data.get('search-query'));
        if (!query || query.trim().length === 0) {
            return fail(400, { error: true, message: 'Search query cannot be empty' });
        }

        const result = await searchGamesByName(query, await getIGDBAccessToken());
        return result;
    }  
};