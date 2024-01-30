import { postsFeedMapper, postsFeedQuery } from '$lib/db/queries-and-mappers';
import { POSTS_IN_HOME_LIMIT } from '$lib/constants';

export const load = async ({ locals }) => {
	const session = await locals.getSession();
	const logged_in_user_id = session?.user?.id;

	if (!logged_in_user_id) return {};

	const postsResult = await postsFeedQuery(logged_in_user_id).limit(POSTS_IN_HOME_LIMIT).offset(0);

	const posts = postsResult.map(postsFeedMapper);
	return { posts };
};
