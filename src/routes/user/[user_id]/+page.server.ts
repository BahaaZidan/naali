import { PUBLIC_CLOUDFLARE_STREAM_CUSTOMER_CODE } from '$env/static/public';
import { followsTable, usersTable, videosTable } from '$lib/db/schema';
import { error, fail } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import { db } from '$lib/db';

export const actions = {
	publish: async ({ locals, request }) => {
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


		const session = await locals.getSession();
		const logged_in_user_id = session?.user?.id;
		if (!logged_in_user_id) return fail(401);

		const update = await db
			.update(videosTable)
			.set({ name, description, publishStatus: 'public' })
			.where(and(eq(videosTable.id, id), eq(videosTable.creator, logged_in_user_id)));
		if (!update) return fail(500);

		return { success: true };
	},
	follow: async ({ locals, request }) => {
		const formData = await request.formData();
		const id = formData.get('id')?.toString();
		if (!id) {
			return fail(400, { id, missing: true });
		}

		const session = await locals.getSession();
		const logged_in_user_id = session?.user?.id;
		if (!logged_in_user_id) return fail(401);
		if (id === logged_in_user_id) return fail(400, { id, incorrect: true });

		const insert = await db
			.insert(followsTable)
			.values({ follower: logged_in_user_id, followed: id });
		if (!insert) return fail(500);

		return { success: true };
	},
	unfollow: async ({ locals, request }) => {
		const formData = await request.formData();
		const id = formData.get('id')?.toString();
		if (!id) {
			return fail(400, { id, missing: true });
		}

		const session = await locals.getSession();
		const logged_in_user_id = session?.user?.id;
		if (!logged_in_user_id) return fail(401);

		const deletion = await db
			.delete(followsTable)
			.where(and(eq(followsTable.follower, logged_in_user_id), eq(followsTable.followed, id)));
		if (!deletion) return fail(500);

		return { success: true };
	}
};

export const load = async ({ params, locals }) => {
	const user_id = params.user_id;
	const user = (await db.select().from(usersTable).where(eq(usersTable.id, user_id)).limit(1))[0];

	if (!user) return error(404);

	const logged_in_user_id = (await locals.getSession())?.user?.id;
	const is_own_profile = logged_in_user_id === user_id;
	const videos_result = await db
		.select()
		.from(videosTable)
		.where(
			is_own_profile
				? eq(videosTable.creator, user_id)
				: and(eq(videosTable.creator, user_id), eq(videosTable.publishStatus, 'public'))
		);
	const videos = videos_result.map((v) => ({
		...v,
		thumbnail: `https://customer-${PUBLIC_CLOUDFLARE_STREAM_CUSTOMER_CODE}.cloudflarestream.com/${v.id}/thumbnails/thumbnail.jpg`
	}));

	const follows = logged_in_user_id
		? await db
			.select()
			.from(followsTable)
			.where(
				and(eq(followsTable.follower, logged_in_user_id), eq(followsTable.followed, user_id))
			)
		: null;
	const is_followed = follows && follows.length > 0;

	return {
		is_own_profile,
		user,
		videos,
		is_followed
	};
};
