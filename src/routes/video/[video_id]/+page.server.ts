import { PUBLIC_CLOUDFLARE_STREAM_CUSTOMER_CODE } from '$env/static/public';
import { usersTable, videosTable } from '$lib/db/schema';
import { error } from '@sveltejs/kit';
import { and, eq, or } from 'drizzle-orm';
import { db } from '$lib/db';

export const load = async ({ params, locals }) => {
	const logged_user_id = (await locals.getSession())?.user?.id;

	// TODO: return SEO info (open graph) without the video id for streaming
	if (!logged_user_id) return error(404);

	const result = await db
		.select()
		.from(videosTable)
		.innerJoin(usersTable, eq(usersTable.id, videosTable.creator))
		.where(
			and(
				eq(videosTable.id, params.video_id),
				or(eq(videosTable.privacy, 'public'), eq(videosTable.creator, logged_user_id))
			)
		)
		.limit(1);
	const video = result[0];
	if (!video) return error(404);

	return {
		video: {
			...video.videos,
			creator: video.user,
			stream_url: `https://customer-${PUBLIC_CLOUDFLARE_STREAM_CUSTOMER_CODE}.cloudflarestream.com/${video.videos.id}/iframe`
		}
	};
};
