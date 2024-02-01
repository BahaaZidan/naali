import * as v from 'valibot';
import { and, eq } from 'drizzle-orm';
import { followsTable, usersTable } from '$lib/db/schema';
import { db } from '$lib/db';
import { error } from '@sveltejs/kit';
import { videosInProfileMapper, videosInProfileQuery } from '$lib/db/queries-and-mappers';
import { VIDEOS_IN_PROFILE_LIMIT } from '$lib/constants';

export async function load({ params, locals }) {
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
}
