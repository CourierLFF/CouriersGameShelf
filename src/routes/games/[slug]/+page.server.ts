import { get } from 'svelte/store';
import type { PageServerLoad } from './$types';
import { getGameByID, getIGDBAccessToken } from '$lib/igdb';
import { addGameToDB, changeGameStateInDB, getGamesFromDB, removeGameFromDB } from '$lib/db';
import { fail, type Actions } from '@sveltejs/kit';
import type { Game } from '$lib/types';

export const load: PageServerLoad = async ({ params }) => {
    const accessToken = await getIGDBAccessToken();
    const allGamesInDB = getGamesFromDB();
    
    if (Number.isNaN(Number(params.slug))) {
        return { error: "Invalid game ID" };
    }

    const game = await getGameByID(Number(params.slug), accessToken);
    if (game.error) {
        return { error: game.error };
    }

    return {
        gameData: game.data,
        allGames: allGamesInDB
    };
}

export const actions: Actions = {
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
    addGame: async ({ request, params }) => {
        const data = await request.formData();

        const gameID = params.slug ? Number(params.slug) : NaN;

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
        
        return {result: result, success: true, message: 'Game added successfully' };    
    }
};