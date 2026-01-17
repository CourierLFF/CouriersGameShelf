import { IGDBID, IGDBSECRET } from "$env/static/private";
import type { Game } from "./types";
import unknownCover from '$lib/assets/images/unknown_cover.png';

let cachedAccessToken: { access_token: string; expires_in: number; token_type: string } | null = null;
let tokenExpiryTime: number = 0;

export async function getIGDBAccessToken() {
    try {
        if (cachedAccessToken && Date.now() < tokenExpiryTime) {
            return cachedAccessToken.access_token;
        }
        const response = await fetch(`https://id.twitch.tv/oauth2/token?client_id=${IGDBID}&client_secret=${IGDBSECRET}&grant_type=client_credentials`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error(`Failed to get IGDB access token: ${response.statusText}`);
        }

        const responseData = await response.json();
        cachedAccessToken = responseData;
        tokenExpiryTime = Date.now() + (responseData.expires_in * 1000);
        return responseData.access_token;
    } catch (error) {
        console.error('Error fetching IGDB access token: ', error);
        throw error;
    }
}

export async function getGameByID(gameID: number, accessToken: string): Promise<{ error: true; message: string } | { error: false; data: Game }> {
    try {
        const response = await fetch('https://api.igdb.com/v4/games/', {
            method: 'POST',
            headers: {
                'Client-ID': IGDBID,
                'Authorization': `Bearer ${accessToken}`,
            },
            body: `fields *; where id = ${gameID};`,
        })
        if (!response.ok) {
            return { error: true, message: `Failed to get game by ID: ${response.statusText}` };
        }

        const responseData = await response.json();

        const returnedGame: Game = {
            id: gameID,
            name: responseData[0].name,
            release_date: responseData[0].first_release_date,
            description: responseData[0].summary,
            cover_art: await getCoverByID(responseData[0].cover, accessToken),
            genres: await getGenreByIDs(responseData[0].genres, accessToken),
            platforms: await getPlatformByIDs(responseData[0].platforms, accessToken),
            game_state: '',
            date_completed: '',
            user_rating: 0
        };
        return { error: false, data: returnedGame };
    } catch (error) {
        console.error('Error fetching game by ID: ', error);
        return { error: true, message: 'An error occurred while fetching the game.'};
    }
}

export async function getCoverByID(coverID: number, accessToken: string) {
    try {
        const response = await fetch('https://api.igdb.com/v4/covers/', {
            method: 'POST',
            headers: {
                'Client-ID': IGDBID,
                'Authorization': `Bearer ${accessToken}`,
            },
            body: `fields *; where id = ${coverID};`,
        })
        if (!response.ok) {
            throw new Error(`Failed to get cover by ID: ${response.statusText}`);
        }

        const responseData = await response.json();
        return `https://images.igdb.com/igdb/image/upload/t_cover_big/${responseData[0].image_id}.webp`;
    } catch (error) {
        console.error('Error fetching cover by ID: ', error);
        return '';
    }
}

export async function getCoversByID(coverIDs: number[], accessToken: string) {
    try {
        const response = await fetch('https://api.igdb.com/v4/covers/', {
            method: 'POST',
            headers: {
                'Client-ID': IGDBID,
                'Authorization': `Bearer ${accessToken}`,
            },
            body: `fields *; where id = (${coverIDs.join(',')}); limit 25;`,
        })
        if (!response.ok) {
            throw new Error(`Failed to get cover by ID: ${response.statusText}`);
        }

        const responseData = await response.json();
        return responseData.map((cover: { image_id: string }) => `https://images.igdb.com/igdb/image/upload/t_cover_big/${cover.image_id}.webp`);
    } catch (error) {
        console.error('Error fetching cover by ID: ', error);
        return '';
    }
}

export async function getGenreByIDs(genreIDs: number[], accessToken: string): Promise<string> {
    try {
        const response = await fetch('https://api.igdb.com/v4/genres/', {
            method: 'POST',
            headers: {
                'Client-ID': IGDBID,
                'Authorization': `Bearer ${accessToken}`,
            },
            body: `fields *; where id = (${genreIDs.join(',')});`,
        })
        if (!response.ok) {
            throw new Error(`Failed to get genres by IDs: ${response.statusText}`);
        }

        const responseData = await response.json();
        const genreNames = responseData.map((genre: { name: string }) => genre.name);
        return genreNames.join(', ');
    } catch (error) {
        console.error('Error fetching genres by IDs: ', error);
        return '';
    }
}

export async function getPlatformByIDs(platformIDs: number[], accessToken: string): Promise<string> {
    try {
        const response = await fetch('https://api.igdb.com/v4/platforms/', {
            method: 'POST',
            headers: {
                'Client-ID': IGDBID,
                'Authorization': `Bearer ${accessToken}`,
            },
            body: `fields *; where id = (${platformIDs.join(',')});`,
        })
        if (!response.ok) {
            throw new Error(`Failed to get platforms by IDs: ${response.statusText}`);
        }

        const responseData = await response.json();
        const platformNames = responseData.map((platform: { name: string }) => platform.name);
        return platformNames.join(', ');
    } catch (error) {
        console.error('Error fetching platforms by IDs: ', error);
        return '';
    }
}

export async function searchGamesByName(query: string, accessToken: string): Promise<{ error: true; message: string } | { error: false; data: Game[] }> {
    try {
        const response = await fetch('https://api.igdb.com/v4/games/', {
            method: 'POST',
            headers: {
                'Client-ID': IGDBID,
                'Authorization': `Bearer ${accessToken}`,
            },
            body: `search "${query}"; fields id, name, first_release_date, summary, cover, genres, platforms; limit 25;`,
        });
        if (!response.ok) {
            return { error: true, message: `Failed to search games by name: ${response.statusText}` };
        }

        const responseData = await response.json();

        const gameIDs = responseData.map((gameData: any) => gameData.id);
        const covers = await getCoversByID(responseData.map((gameData: any) => gameData.cover).filter((id: number) => id !== undefined), accessToken);

        const games: Game[] = await Promise.all(responseData.map(async (gameData: any) => {
            return {
                id: gameData.id,
                name: gameData.name,
                release_date: gameData.first_release_date,
                description: '',
                cover_art: '',
                genres: '',
                platforms: '',
                game_state: '',
                date_completed: '',
                user_rating: 0
            };
        }));

        for (let i = 0; i < games.length; i++) {
            if (covers[i] !== undefined) {
                games[i].cover_art = covers[i];
            } else {
                games[i].cover_art = unknownCover;
            }
        }
        
        // console.log(games);

        return { error: false, data: games };
    }
    catch (error) {
        console.error('Error searching games by name: ', error);
        return { error: true, message: 'An error occurred while searching for games.'};
    }
}