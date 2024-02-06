import { SvelteKitAuth } from '@auth/sveltekit';
import GitHub from '@auth/core/providers/github';
import Google from '@auth/core/providers/google';
import {
	AUTH_SECRET,
	GITHUB_ID,
	GITHUB_SECRET,
	GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET
} from '$env/static/private';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { db } from '$lib/db';
import { accountsTable, sessionsTable, usersTable, verificationTokensTable } from '$lib/db/schema';

export const handle = SvelteKitAuth(async () => {
	return {
		providers: [
			GitHub({ clientId: GITHUB_ID, clientSecret: GITHUB_SECRET }),
			Google({ clientId: GOOGLE_CLIENT_ID, clientSecret: GOOGLE_CLIENT_SECRET })
		],
		secret: AUTH_SECRET,
		trustHost: true,
		adapter: DrizzleAdapter(
			db,
			// @ts-expect-error wrong auth.js types. again.
			(table) => {
				switch (table) {
					case 'user':
						return usersTable;
					case 'account':
						return accountsTable;
					case 'session':
						return sessionsTable;
					case 'verificationToken':
						return verificationTokensTable;
					default:
						throw new Error(`Table ${table} not found`);
				}
			}
		),
		callbacks: {
			session: async ({ session, user }) => {
				if (session?.user) {
					session.user.id = user.id;
					// @ts-expect-error wrong auth.js types
					session.user.handle = user.handle;
				}
				return session;
			}
		}
		// TODO: implement a logger ?
	};
});
