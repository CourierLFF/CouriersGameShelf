import { IGDBID, IGDBSECRET } from "$env/static/private";

let cachedAccessToken: { accessToken: string; expires_in: number; token_type: string } | null = null;
let tokenExpiryTime: number = 0;

export async function getIGDBAccessToken() {
    try {
        if (cachedAccessToken && Date.now() < tokenExpiryTime) {
            return cachedAccessToken;
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
        return responseData;
    } catch (error) {
        console.error('Error fetching IGDB access token:', error);
        throw error;
    }
}