import { PUBLIC_CLOUDFLARE_STREAM_CUSTOMER_CODE } from '$env/static/public';
import { likesTable, postsTable, usersTable, videosTable } from '$lib/db/schema';
import { error, fail } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import { db } from '$lib/db';
import * as v from 'valibot';
import { streamSignedUrl } from '$lib/utils/tokens';

export const load = async ({ params, locals }) => {
	const result = await db
		.select()
		.from(videosTable)
		.innerJoin(usersTable, eq(usersTable.id, videosTable.creator))
		.where(eq(videosTable.id, params.video_id))
		.limit(1);
	const video = result[0];
	if (!video) return error(404);

	const logged_user_id = (await locals.auth())?.user?.id;
	// TODO: return SEO info (open graph) without the video id for streaming
	if (!logged_user_id) return error(404);

	const like = (
		await db
			.select()
			.from(likesTable)
			.where(and(eq(likesTable.videoId, video.videos.id), eq(likesTable.liker, logged_user_id)))
			.limit(1)
	)[0];

	const isRepostedByAuthenticatedUser = !!(
		await db
			.select()
			.from(postsTable)
			.where(and(eq(postsTable.videoId, params.video_id), eq(postsTable.creator, logged_user_id)))
	)[0];

	const token = await streamSignedUrl(video.videos.id);
	return {
		video: {
			...video.videos,
			like: like?.value as boolean | undefined,
			isOwn: logged_user_id === video.videos.creator,
			isRepostedByAuthenticatedUser,
			creator: video.user,
			stream_url: `https://customer-${PUBLIC_CLOUDFLARE_STREAM_CUSTOMER_CODE}.cloudflarestream.com/${token}/iframe`
		}
	};
};

export const actions = {
	like: async ({ locals, request }) => {
		const formData = await request.formData();
		const schema = v.object({
			id: v.string([v.minLength(1), v.maxLength(32)]),
			value: v.picklist(['delete', 'true', 'false'])
		});
		const inputValidation = v.safeParse(schema, Object.fromEntries(formData.entries()));
		if (!inputValidation.success) {
			return fail(400, v.flatten(inputValidation.error));
		}

		const { id, value: valueString } = inputValidation.output;

		const session = await locals.auth();
		const logged_in_user_id = session?.user?.id;
		if (!logged_in_user_id) return fail(401);

		if (valueString === 'delete') {
			await db
				.delete(likesTable)
				.where(and(eq(likesTable.liker, logged_in_user_id), eq(likesTable.videoId, id)));
			return { success: true };
		}

		const value = valueString === 'true';
		await db
			.insert(likesTable)
			.values({ value, liker: logged_in_user_id, videoId: id })
			.onConflictDoUpdate({ target: [likesTable.liker, likesTable.videoId], set: { value } });

		return { success: true, like: value };
	},
	repost: async ({ locals, request }) => {
		const formData = await request.formData();
		const schema = v.object({
			videoId: v.string([v.minLength(1), v.maxLength(32)]),
			createdAt: v.transform(v.string([v.isoTimestamp()]), (iso) => new Date(iso))
		});
		const inputValidation = v.safeParse(schema, Object.fromEntries(formData.entries()));
		if (!inputValidation.success) {
			return fail(400, v.flatten(inputValidation.error));
		}
		const { videoId, createdAt } = inputValidation.output;
		const session = await locals.auth();
		const logged_in_user_id = session?.user?.id;
		if (!logged_in_user_id) return fail(401);

		await db.insert(postsTable).values({ videoId, createdAt, creator: logged_in_user_id });

		return { success: true };
	},
	undo_repost: async ({ locals, request }) => {
		const formData = await request.formData();
		const schema = v.object({
			videoId: v.string([v.minLength(1), v.maxLength(32)])
		});
		const inputValidation = v.safeParse(schema, Object.fromEntries(formData.entries()));
		if (!inputValidation.success) {
			return fail(400, v.flatten(inputValidation.error));
		}
		const { videoId } = inputValidation.output;
		const session = await locals.auth();
		const logged_in_user_id = session?.user?.id;
		if (!logged_in_user_id) return fail(401);

		await db
			.delete(postsTable)
			.where(and(eq(postsTable.creator, logged_in_user_id), eq(postsTable.videoId, videoId)));

		return { success: true };
	}
};
