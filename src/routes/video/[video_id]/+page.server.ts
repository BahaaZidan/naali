import { PUBLIC_CLOUDFLARE_STREAM_CUSTOMER_CODE } from '$env/static/public';
import { get_db } from '$lib/db';
import { videos_table } from '$lib/db/schema';
import { error } from '@sveltejs/kit';
import { and, eq, or } from 'drizzle-orm';

export const load = async ({ params, locals }) => {
	const db = get_db(locals.DB);

	const logged_user_id = (await locals.getSession())?.user?.id;

	// TODO: return SEO info (open graph) without the video id for streaming
	if (!logged_user_id) return error(404);

	const result = await db
		.select()
		.from(videos_table)
		.where(
			and(
				eq(videos_table.id, params.video_id),
				or(eq(videos_table.publish_status, 'public'), eq(videos_table.creator, logged_user_id))
			)
		)
		.limit(1);
	const video = result[0];
	if (!video) return error(404);

	return {
		video: {
			...video,
			stream_url: `https://customer-${PUBLIC_CLOUDFLARE_STREAM_CUSTOMER_CODE}.cloudflarestream.com/${video.id}/iframe`
		}
	};
};
