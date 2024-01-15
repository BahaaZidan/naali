import { PUBLIC_CLOUDFLARE_STREAM_CUSTOMER_CODE } from '$env/static/public';
import { get_db } from '$lib/db';
import { usersTable, videos_table } from '$lib/db/schema.js';
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
		const description = formData.get('description')?.toString();
		if (!description) {
			return fail(400, { description, missing: true });
		}

		const db = get_db(locals.DB);

		const session = await locals.getSession();
		const logged_in_user_id = session?.user?.id;
		if (!logged_in_user_id) return fail(401);

		const insertion = await db
			.update(videos_table)
			.set({ name, description, publish_status: 'public' })
			.where(and(eq(videos_table.id, id), eq(videos_table.creator, logged_in_user_id)));
		if (!insertion.success) return fail(500);

		return { success: true };
	}
};

export const load = async ({ params, locals }) => {
	const db = get_db(locals.DB);
	const user_id = params.user_id;
	const user = (await db.select().from(usersTable).where(eq(usersTable.id, user_id)))[0];

	if (!user) return error(404);

	const logged_in_user_id = (await locals.getSession())?.user?.id;
	const is_own_profile = logged_in_user_id === user_id;
	const videos_result = await db
		.select()
		.from(videos_table)
		.where(
			is_own_profile
				? eq(videos_table.creator, user_id)
				: and(eq(videos_table.creator, user_id), eq(videos_table.publish_status, 'public'))
		);

	const videos = videos_result.map((v) => ({
		...v,
		thumbnail: `https://customer-${PUBLIC_CLOUDFLARE_STREAM_CUSTOMER_CODE}.cloudflarestream.com/${v.id}/thumbnails/thumbnail.jpg`
	}));

	return {
		is_own_profile,
		user,
		videos
	};
};
