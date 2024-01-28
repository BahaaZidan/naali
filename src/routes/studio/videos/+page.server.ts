import { CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_STREAM_API_TOKEN } from '$env/static/private';
import { PUBLIC_CLOUDFLARE_STREAM_CUSTOMER_CODE } from '$env/static/public';
import { videosTable } from '$lib/db/schema';
import { error, fail } from '@sveltejs/kit';
import { and, desc, eq } from 'drizzle-orm';
import { db } from '$lib/db';
import * as v from 'valibot';

export const actions = {
	delete: async ({ locals, request }) => {
		const formData = await request.formData();
		const idInput = formData.get('id')?.toString();
		const parsedInput = v.safeParse(v.string([v.minLength(1), v.maxLength(32)]), idInput);
		if (!parsedInput.success) {
			return fail(400, { errors: v.flatten(parsedInput.error) });
		}
		const id = parsedInput.output;

		const session = await locals.getSession();
		const logged_in_user_id = session?.user?.id;
		if (!logged_in_user_id) return fail(401);

		const deletion = await db
			.delete(videosTable)
			.where(and(eq(videosTable.id, id), eq(videosTable.creator, logged_in_user_id)));
		if (!deletion) return fail(500);

		const endpoint = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/stream/${id}`;
		const response = await fetch(endpoint, {
			method: 'DELETE',
			headers: {
				Authorization: `bearer ${CLOUDFLARE_STREAM_API_TOKEN}`
			}
		});

		if (response.status !== 200) return fail(500);

		return { success: true };
	}
};

export const load = async ({ locals }) => {
	const session = await locals.getSession();
	const user = session?.user;
	if (!user?.id) return error(401);

	const videos_result = await db
		.select()
		.from(videosTable)
		.where(eq(videosTable.creator, user.id))
		.orderBy(desc(videosTable.createdAt));

	const videos = videos_result.map((v) => ({
		...v,
		thumbnail: `https://customer-${PUBLIC_CLOUDFLARE_STREAM_CUSTOMER_CODE}.cloudflarestream.com/${v.id}/thumbnails/thumbnail.jpg`
	}));

	return {
		videos
	};
};
