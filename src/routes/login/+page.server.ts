import { ADMINUSER, ADMINPASSWORD } from '$env/static/private';
import { sha256 } from '$lib/crypto.js';
import { fail, redirect, type Actions } from '@sveltejs/kit';

export async function load({ cookies }) {
    const user = cookies.get('session_id');
    const adminHash = await sha256(`${ADMINUSER}:${ADMINPASSWORD}`);

    if (user === adminHash) {
        throw redirect(303, '/');
    }
}

export const actions: Actions = {
        default: async ({ cookies, request}) => {
            const data = await request.formData();

            const adminHash = await sha256(`${ADMINUSER}:${ADMINPASSWORD}`);
            const loginHash = await sha256(`${data.get('username')}:${data.get('password')}`);

            if (adminHash === loginHash) {
                cookies.set('session_id', adminHash, { path: '/' });
                throw redirect(303, '/');
            } else {
                return fail(401, { error: true, message: 'Invalid username or password' });
            }
    }
}