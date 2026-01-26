import { getGamesFromDB } from '$lib/db';
import crypto from 'crypto';

export function GET({ request }) {
    const games = getGamesFromDB();
    const body = JSON.stringify(games);

    const etag = `"${crypto.createHash("sha1").update(body).digest("hex")}"`;

    if (request.headers.get("if-none-match") === etag) {
        return new Response(null, {
            status: 304,
            headers: {
                "Cache-Control": "public, max-age=86400, stale-while-revalidate=3600",
                "ETag": etag
            }
        });
    }

    return new Response(body, {
        status: 200,
        headers: {
            "Content-Type": "application/json",
            "Cache-Control": "public, max-age=86400",
            "ETag": etag
        }
    });
}