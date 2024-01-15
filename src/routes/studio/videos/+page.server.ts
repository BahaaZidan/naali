import { PUBLIC_CLOUDFLARE_STREAM_CUSTOMER_CODE } from '$env/static/public';
import { get_db } from '$lib/db';
import { videos_table } from '$lib/db/schema';
import { error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const load = async ({ locals }) => {
	const session = await locals.getSession();
	const user = session?.user;
	if (!user?.id) return error(401);

	const db = get_db(locals.DB);

	const videos_result = await db
		.select()
		.from(videos_table)
		.where(eq(videos_table.creator, user.id));

	const videos = videos_result.map((v) => ({
		...v,
		thumbnail: `https://customer-${PUBLIC_CLOUDFLARE_STREAM_CUSTOMER_CODE}.cloudflarestream.com/${v.id}/thumbnails/thumbnail.jpg`
	}));

	return {
		videos
	};
};
