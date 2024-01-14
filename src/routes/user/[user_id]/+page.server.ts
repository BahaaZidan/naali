import { PUBLIC_CLOUDFLARE_STREAM_CUSTOMER_CODE } from '$env/static/public';
import { get_db } from '$lib/db';
import { usersTable, videos_table } from '$lib/db/schema.js';
import { error } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';

export const load = async ({ params, locals }) => {
	const db = get_db(locals.DB);
	const user_id = params.user_id;
	const user = (await db.select().from(usersTable).where(eq(usersTable.id, user_id)))[0];

	if (!user) return error(404);

	const logged_in_user_id = (await locals.getSession())?.user?.id;
	const is_own_videos = logged_in_user_id === user_id;
	const videos_result = await db
		.select()
		.from(videos_table)
		.where(
			is_own_videos
				? eq(videos_table.creator, user_id)
				: and(eq(videos_table.creator, user_id), eq(videos_table.publish_status, 'public'))
		);

	return {
		user,
		videos: videos_result.map((v) => ({
			...v,
			thumbnail: `https://customer-${PUBLIC_CLOUDFLARE_STREAM_CUSTOMER_CODE}.cloudflarestream.com/${v.id}/thumbnails/thumbnail.jpg`
		}))
	};
};
