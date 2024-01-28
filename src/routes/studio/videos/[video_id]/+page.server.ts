import { PUBLIC_CLOUDFLARE_STREAM_CUSTOMER_CODE } from '$env/static/public';
import { videosTable } from '$lib/db/schema';
import { error, fail } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import { db } from '$lib/db';
import * as v from 'valibot';

export const actions = {
	default: async ({ locals, request }) => {
		const formData = await request.formData();
		const schema = v.object({
			name: v.string([v.toTrimmed(), v.minLength(1), v.maxLength(80)]),
			id: v.string([v.minLength(1), v.maxLength(32)]),
			description: v.optional(v.string([v.toTrimmed(), v.maxLength(5000)]))
		});
		const inputValidation = v.safeParse(schema, Object.fromEntries(formData.entries()));
		if (!inputValidation.success) {
			return fail(400, { errors: v.flatten(inputValidation.error) });
		}

		const session = await locals.getSession();
		const logged_in_user_id = session?.user?.id;
		if (!logged_in_user_id) return fail(401);

		const { id, name, description } = inputValidation.output;
		const update = await db
			.update(videosTable)
			.set({
				name,
				description
			})
			.where(and(eq(videosTable.id, id), eq(videosTable.creator, logged_in_user_id)));
		// TODO: better error detection
		if (!update) return fail(500);

		return { success: true };
	}
};

export const load = async ({ params, locals }) => {
	const logged_user_id = (await locals.getSession())?.user?.id;
	if (!logged_user_id) return error(404);

	const result = await db
		.select()
		.from(videosTable)
		.where(and(eq(videosTable.id, params.video_id), eq(videosTable.creator, logged_user_id)))
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
