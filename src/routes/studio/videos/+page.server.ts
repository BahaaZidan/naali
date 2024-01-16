import { CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_STREAM_API_TOKEN } from '$env/static/private';
import { PUBLIC_CLOUDFLARE_STREAM_CUSTOMER_CODE } from '$env/static/public';
import { get_db } from '$lib/db';
import { videos_table } from '$lib/db/schema';
import { error, fail } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';

export const actions = {
	delete: async ({ locals, request }) => {
		const formData = await request.formData();
		const id = formData.get('id')?.toString();
		if (!id) {
			return fail(400, { id, missing: true });
		}

		const session = await locals.getSession();
		const logged_in_user_id = session?.user?.id;
		if (!logged_in_user_id) return fail(401);

		const db = get_db(locals.DB);
		const deletion = await db
			.delete(videos_table)
			.where(and(eq(videos_table.id, id), eq(videos_table.creator, logged_in_user_id)));
		if (!deletion.success) return fail(500);

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
