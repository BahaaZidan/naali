import { followsTable, usersTable } from '$lib/db/schema';
import { error, fail } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import { db } from '$lib/db';
import * as v from 'valibot';
import { videosInProfileMapper, videosInProfileQuery } from '$lib/db/queries-and-mappers';
import { VIDEOS_IN_PROFILE_LIMIT } from '$lib/constants';

export const actions = {
	follow: async ({ locals, request }) => {
		const formData = await request.formData();
		const idInput = formData.get('id')?.toString();
		const parsedInput = v.safeParse(v.string([v.uuid()]), idInput);
		if (!parsedInput.success) {
			return fail(400, v.flatten(parsedInput.error));
		}
		const id = parsedInput.output;
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
		const idInput = formData.get('id')?.toString();
		const parsedInput = v.safeParse(v.string([v.uuid()]), idInput);
		if (!parsedInput.success) {
			return fail(400, v.flatten(parsedInput.error));
		}
		const id = parsedInput.output;

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
	const uid = params.uid;
	const uuidSchema = v.string([v.uuid()]);
	const userQueryCondition = v.safeParse(uuidSchema, uid).success
		? eq(usersTable.id, uid)
		: eq(usersTable.handle, uid);

	const user = (await db.select().from(usersTable).where(userQueryCondition).limit(1))[0];
	if (!user) return error(404);

	const user_id = user.id;
	const logged_in_user_id = (await locals.getSession())?.user?.id;
	const is_own_profile = logged_in_user_id === user_id;
	const videos_result = await videosInProfileQuery(user_id)
		.offset(0)
		.limit(VIDEOS_IN_PROFILE_LIMIT);
	const videos = videos_result.map(videosInProfileMapper);

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
