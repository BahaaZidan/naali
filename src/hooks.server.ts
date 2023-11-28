import { connectD1 } from 'wrangler-proxy';
import { SvelteKitAuth } from '@auth/sveltekit';
import GitHub from '@auth/core/providers/github';
import { GITHUB_ID, GITHUB_SECRET, AUTH_SECRET } from '$env/static/private';
import type { Handle } from '@sveltejs/kit';
import { D1Adapter } from '$lib/db/d1_adapter';

export const handle = SvelteKitAuth(async (event) => {
	event.locals.DB = event.platform?.env?.DB ?? connectD1('DB');
	return {
		providers: [GitHub({ clientId: GITHUB_ID, clientSecret: GITHUB_SECRET })],
		secret: AUTH_SECRET,
		trustHost: true,
		adapter: D1Adapter(event.locals.DB)
		// TODO: implement a logger ?
	};
}) satisfies Handle;
