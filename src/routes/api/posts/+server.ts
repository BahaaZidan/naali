import { error, json } from '@sveltejs/kit';
import * as v from 'valibot';
import { minLength } from 'valibot';
import { postsFeedMapper, postsFeedQuery } from '$lib/db/queries-and-mappers';
import { db } from '$lib/db';
import { postsTable } from '$lib/db/schema';

export async function GET({ locals, url }) {
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
}

export async function POST({ locals, request }) {
	const session = await locals.getSession();
	const authenticatedUserId = session?.user?.id;
	if (!authenticatedUserId) return error(401);

	const body = await request.json();
	const schema = v.object({
		videoId: v.string([minLength(32)]),
		createdAt: v.transform(v.string([v.isoTimestamp()]), (iso) => new Date(iso))
	});
	const { videoId, createdAt } = v.parse(schema, body);

	await db
		.insert(postsTable)
		.values({ creator: authenticatedUserId, videoId, type: 'video', createdAt });

	return json({ success: true });
}
