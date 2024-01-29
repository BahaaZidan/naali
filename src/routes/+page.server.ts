import { postsFeedMapper, postsFeedQuery } from '$lib/db/queries-and-mappers';

export const load = async ({ locals }) => {
	const session = await locals.getSession();
	const logged_in_user_id = session?.user?.id;

	if (!logged_in_user_id) return {};

	const postsResult = await postsFeedQuery(logged_in_user_id).limit(20).offset(0);

	const posts = postsResult.map(postsFeedMapper);
	return { posts };
};
