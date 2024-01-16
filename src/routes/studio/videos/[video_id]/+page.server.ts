import { PUBLIC_CLOUDFLARE_STREAM_CUSTOMER_CODE } from '$env/static/public';
import { get_db } from '$lib/db';
import { videos_table } from '$lib/db/schema';
import { error, fail } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';

export const actions = {
	default: async ({ locals, request }) => {
		const formData = await request.formData();
		const name = formData.get('name')?.toString();
		if (!name) {
			return fail(400, { name, missing: true });
		}
		const id = formData.get('id')?.toString();
		if (!id) {
			return fail(400, { id, missing: true });
		}
		const publish_status = formData.get('publish_status')?.toString();
		if (!publish_status) {
			return fail(400, { publish_status, missing: true });
		}
		if (!['public', 'private'].includes(publish_status)) {
			return fail(400, { publish_status, incorrect: true });
		}
		const description = formData.get('description')?.toString();

		const session = await locals.getSession();
		const logged_in_user_id = session?.user?.id;
		if (!logged_in_user_id) return fail(401);

		const db = get_db(locals.DB);
		const update = await db
			.update(videos_table)
			.set({
				name,
				description,
				// @ts-expect-error check on line 22 should be enough but ts can't narrow down the type from it.
				publish_status
			})
			.where(and(eq(videos_table.id, id), eq(videos_table.creator, logged_in_user_id)));
		if (!update.success) return fail(500);

		return { success: true };
	}
};

export const load = async ({ params, locals }) => {
	const db = get_db(locals.DB);

	const logged_user_id = (await locals.getSession())?.user?.id;
	if (!logged_user_id) return error(404);

	const result = await db
		.select()
		.from(videos_table)
		.where(and(eq(videos_table.id, params.video_id), eq(videos_table.creator, logged_user_id)))
		.limit(1);
	const video = result[0];
	if (!video) return error(404);

	return {
		video: {
			...video,
			stream_url: `https://customer-${PUBLIC_CLOUDFLARE_STREAM_CUSTOMER_CODE}.cloudflarestream.com/${video.id}/iframe`,
			thumbnail: `https://customer-${PUBLIC_CLOUDFLARE_STREAM_CUSTOMER_CODE}.cloudflarestream.com/${video.id}/thumbnails/thumbnail.jpg`
		}
	};
};
