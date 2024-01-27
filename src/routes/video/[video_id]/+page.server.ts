import { PUBLIC_CLOUDFLARE_STREAM_CUSTOMER_CODE } from '$env/static/public';
import { likesTable, usersTable, videosTable } from '$lib/db/schema';
import { error, fail } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import { db } from '$lib/db';

export const load = async ({ params, locals }) => {
	const logged_user_id = (await locals.getSession())?.user?.id;

	// TODO: return SEO info (open graph) without the video id for streaming
	if (!logged_user_id) return error(404);

	const result = await db
		.select()
		.from(videosTable)
		.innerJoin(usersTable, eq(usersTable.id, videosTable.creator))
		.leftJoin(
			likesTable,
			and(eq(likesTable.videoId, videosTable.id), eq(likesTable.liker, logged_user_id))
		)
		.where(eq(videosTable.id, params.video_id))
		.limit(1);
	const video = result[0];
	if (!video) return error(404);

	return {
		video: {
			...video.videos,
			like: video.likes?.value,
			isOwn: logged_user_id === video.videos.creator,
			creator: video.user,
			stream_url: `https://customer-${PUBLIC_CLOUDFLARE_STREAM_CUSTOMER_CODE}.cloudflarestream.com/${video.videos.id}/iframe`
		}
	};
};

export const actions = {
	like: async ({ locals, request }) => {
		const formData = await request.formData();
		const id = formData.get('id')?.toString();
		if (!id) {
			return fail(400, { id, missing: true });
		}
		const valueString = formData.get('value')?.toString();
		if (!valueString) {
			return fail(400, { value: valueString, missing: true });
		}

		const session = await locals.getSession();
		const logged_in_user_id = session?.user?.id;
		if (!logged_in_user_id) return fail(401);

		if (valueString === 'delete') {
			const deletion = await db
				.delete(likesTable)
				.where(and(eq(likesTable.liker, logged_in_user_id), eq(likesTable.videoId, id)));
			if (!deletion) fail(500);
			return { success: true };
		}

		const value = valueString === 'true';
		const upsert = await db
			.insert(likesTable)
			.values({ value, liker: logged_in_user_id, videoId: id })
			.onConflictDoUpdate({ target: [likesTable.liker, likesTable.videoId], set: { value } });
		if (!upsert) fail(500);

		return { success: true };
	}
};
