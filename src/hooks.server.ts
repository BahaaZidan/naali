import { connectD1 } from 'wrangler-proxy';
import { SvelteKitAuth } from '@auth/sveltekit';
import GitHub from '@auth/core/providers/github';
import Google from '@auth/core/providers/google';
import {
	GITHUB_ID,
	GITHUB_SECRET,
	AUTH_SECRET,
	GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET
} from '$env/static/private';
import type { Handle } from '@sveltejs/kit';
import { D1Adapter } from '$lib/db/d1_adapter';

export const handle = SvelteKitAuth(async (event) => {
	event.locals.DB = event.platform?.env?.DB ?? connectD1('DB');
	return {
		providers: [
			GitHub({ clientId: GITHUB_ID, clientSecret: GITHUB_SECRET }),
			Google({ clientId: GOOGLE_CLIENT_ID, clientSecret: GOOGLE_CLIENT_SECRET })
		],
		secret: AUTH_SECRET,
		trustHost: true,
		adapter: D1Adapter(event.locals.DB),
		callbacks: {
			session: async ({
				session,
				// @ts-expect-error wrong auth.js types
				user
			}) => {
				if (session?.user) {
					session.user.id = user.id;
				}
				return session;
			}
		}
		// TODO: implement a logger ?
	};
}) satisfies Handle;
