import { error, json } from '@sveltejs/kit';
import * as v from 'valibot';
import { videosInProfileMapper, videosInProfileQuery } from '$lib/db/queries-and-mappers';

export const GET = async ({ locals, url, params }) => {
	const session = await locals.auth();
	const authenticatedUserId = session?.user?.id;
	if (!authenticatedUserId) return error(401);

	const queryStrings = Object.fromEntries(url.searchParams.entries());
	const schema = v.object({
		limit: v.coerce(v.number([v.integer(), v.minValue(1), v.maxValue(40)]), Number),
		offset: v.coerce(v.number([v.integer(), v.minValue(0), v.maxValue(1000)]), Number)
	});
	const validatedBody = v.parse(schema, queryStrings);

	const result = await videosInProfileQuery(params.user_id)
		.limit(validatedBody.limit)
		.offset(validatedBody.offset);

	const videos = await Promise.all(result.map(videosInProfileMapper));
	return json({ videos });
};
