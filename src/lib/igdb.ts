import { IGDBID, IGDBSECRET } from "$env/static/private";

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

export async function getGameByID(gameID: number, accessToken: string) {
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
            throw new Error(`Failed to get game by ID: ${response.statusText}`);
        }

        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.error('Error fetching game by ID: ', error);
        throw error;
    }
}