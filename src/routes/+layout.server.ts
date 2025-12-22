import { ADMINUSER, ADMINPASSWORD } from '$env/static/private';
import { sha256 } from '$lib/crypto.js';
import { redirect } from '@sveltejs/kit';

export async function load({ cookies, url }) {
    const user = cookies.get('session_id');

    if (user !== await sha256(`${ADMINUSER}:${ADMINPASSWORD}`) && url.pathname !== '/login') {
        throw redirect(303, `/login`);
    }

    return { user };
}