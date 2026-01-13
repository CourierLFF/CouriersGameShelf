import { getIGDBAccessToken, searchGamesByName } from "$lib/igdb";
import { fail, type Actions } from "@sveltejs/kit";

export const actions: Actions = {
    searchGame: async ({ request }) => {
        const data = await request.formData();

        const query = String(data.get('search-query'));
        if (!query || query.trim().length === 0) {
            return fail(400, { error: true, message: 'Search query cannot be empty' });
        }

        const result = await searchGamesByName(query, await getIGDBAccessToken());
        return result;
    }      
}