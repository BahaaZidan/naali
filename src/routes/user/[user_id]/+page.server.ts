import { CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_STREAM_API_TOKEN } from '$env/static/private';
import { get_db } from '$lib/db';
import { usersTable } from '$lib/db/schema.js';
import type { Result, VideoDetails } from '$lib/types/cloudflare';
import { error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const load = async ({ params, locals, fetch }) => {
	const db = get_db(locals.DB);
	const user_id = params.user_id;
	const user_result = await db.select().from(usersTable).where(eq(usersTable.id, user_id));
	const user = user_result[0];

	if (!user) return error(404);

	const cf_endpoint = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/stream?creator=${user_id}`;

	const videos_result = await (
		await fetch(cf_endpoint, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `bearer ${CLOUDFLARE_STREAM_API_TOKEN}`
			}
		})
	).json<Result<VideoDetails[]>>();

	if (!videos_result.success) return error(500);

	return {
		user,
		videos: videos_result.result?.map((v) => ({
			name: v.meta.name,
			id: v.uid,
			thumbnail: v.thumbnail
		}))
	};
};
