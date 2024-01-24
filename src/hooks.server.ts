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
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { db } from '$lib/db';

export const handle = SvelteKitAuth(async () => {
	return {
		providers: [
			GitHub({ clientId: GITHUB_ID, clientSecret: GITHUB_SECRET }),
			Google({ clientId: GOOGLE_CLIENT_ID, clientSecret: GOOGLE_CLIENT_SECRET })
		],
		secret: AUTH_SECRET,
		trustHost: true,
		adapter: DrizzleAdapter(db),
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
