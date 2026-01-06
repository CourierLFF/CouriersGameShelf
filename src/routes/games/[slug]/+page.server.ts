import { get } from 'svelte/store';
import type { PageServerLoad } from './$types';
import { getGameByID, getIGDBAccessToken } from '$lib/igdb';
import { changeGameStateInDB, getGamesFromDB, removeGameFromDB } from '$lib/db';
import { fail, type Actions } from '@sveltejs/kit';

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
};