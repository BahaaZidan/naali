import * as v from 'valibot';
import { and, eq } from 'drizzle-orm';
import { followsTable, usersTable } from '$lib/db/schema';
import { db } from '$lib/db';
import { error } from '@sveltejs/kit';

export async function load({ params, locals, url }) {
	const uid = params.uid;
	const userQueryCondition = v.safeParse(v.string([v.uuid()]), uid).success
		? eq(usersTable.id, uid)
		: eq(usersTable.handle, uid);

	const user = (await db.select().from(usersTable).where(userQueryCondition).limit(1))[0];
	if (!user) return error(404);

	const seo = {
		title: user.name,
		og: {
			title: user.name,
			'profile:username': user.handle,
			site_name: 'naali',
			type: 'profile',
			url: url.toString()
		}
	};

	const user_id = user.id;
	const logged_in_user_id = (await locals.auth())?.user?.id;
	const is_own_profile = logged_in_user_id === user_id;

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
		is_followed,
		seo
	};
}
