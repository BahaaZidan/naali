import { followsTable } from '$lib/db/schema';
import { fail } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import { db } from '$lib/db';
import * as v from 'valibot';
import { videosInProfileMapper, videosInProfileQuery } from '$lib/db/queries-and-mappers';
import { VIDEOS_IN_PROFILE_LIMIT } from '$lib/constants';

export async function load({ parent, locals }) {
	const session = await locals.auth();
	const authenticatedUserId = session?.user?.id;
	// TODO: for security, we can't return the token in the thumbnail
	//  revisit this when you're implementing the custom thumbnail feature
	// a potential fix is to proxy all thumbnail images through a worker or something
	if (!authenticatedUserId) return { videos: [] };

	const { user } = await parent();
	const videos_result = await videosInProfileQuery(user.id)
		.offset(0)
		.limit(VIDEOS_IN_PROFILE_LIMIT);
	const videos = await Promise.all(videos_result.map(videosInProfileMapper));
	return { videos };
}

export const actions = {
	follow: async ({ locals, request }) => {
		const formData = await request.formData();
		const idInput = formData.get('id')?.toString();
		const parsedInput = v.safeParse(v.string([v.uuid()]), idInput);
		if (!parsedInput.success) {
			return fail(400, v.flatten(parsedInput.error));
		}
		const id = parsedInput.output;
		const session = await locals.auth();
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

		const session = await locals.auth();
		const logged_in_user_id = session?.user?.id;
		if (!logged_in_user_id) return fail(401);

		const deletion = await db
			.delete(followsTable)
			.where(and(eq(followsTable.follower, logged_in_user_id), eq(followsTable.followed, id)));
		if (!deletion) return fail(500);

		return { success: true };
	}
};
