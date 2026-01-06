import { get } from 'svelte/store';
import type { PageServerLoad } from './$types';
import { getGameByID, getIGDBAccessToken } from '$lib/igdb';
import { getGamesFromDB } from '$lib/db';

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