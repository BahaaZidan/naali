import { error, json, type RequestHandler } from '@sveltejs/kit';
import * as v from 'valibot';
import { postsFeedMapper, postsFeedQuery } from '$lib/db/queries-and-mappers';

export const GET: RequestHandler = async ({ locals, url }) => {
	const session = await locals.getSession();
	const authenticatedUserId = session?.user?.id;
	if (!authenticatedUserId) return error(401);

	const queryStrings = Object.fromEntries(url.searchParams.entries());
	const schema = v.object({
		limit: v.coerce(v.number([v.integer(), v.minValue(1), v.maxValue(20)]), Number),
		offset: v.coerce(v.number([v.integer(), v.minValue(0), v.maxValue(1000)]), Number)
	});
	const validatedBody = v.parse(schema, queryStrings);

	const postsResult = await postsFeedQuery(authenticatedUserId)
		.limit(validatedBody.limit)
		.offset(validatedBody.offset);

	const posts = postsResult.map(postsFeedMapper);
	return json({ posts });
};
