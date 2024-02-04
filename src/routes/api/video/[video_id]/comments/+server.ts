import { error, json } from '@sveltejs/kit';
import { db } from '$lib/db';
import { commentsTable, usersTable } from '$lib/db/schema';
import { desc, eq } from 'drizzle-orm';
import * as v from 'valibot';
import { COMMENTS_LIMIT } from '$lib/constants';

export async function GET({ params, locals, url }) {
	const session = await locals.auth();
	const authenticatedUserId = session?.user?.id;
	if (!authenticatedUserId) return error(401);

	const queryStrings = Object.fromEntries(url.searchParams.entries());
	const schema = v.object({
		offset: v.optional(v.coerce(v.number([v.integer(), v.minValue(0), v.maxValue(1000)]), Number))
	});
	const validatedBody = v.parse(schema, queryStrings);
	const result = await db
		.select()
		.from(commentsTable)
		.innerJoin(usersTable, eq(usersTable.id, commentsTable.creator))
		.where(eq(commentsTable.videoId, params.video_id))
		.orderBy(desc(commentsTable.createdAt))
		.limit(COMMENTS_LIMIT)
		.offset(validatedBody.offset || 0);

	const comments = result.map((r) => ({
		...r.comments,
		creator: r.user
	}));

	return json({ comments });
}

export async function POST({ params, locals, request }) {
	const session = await locals.auth();
	const authenticatedUserId = session?.user?.id;
	if (!authenticatedUserId) return error(401);

	const body = await request.json();
	const { content } = v.parse(
		v.object({
			content: v.string([v.toTrimmed(), v.maxLength(5000), v.minLength(1)])
		}),
		body
	);
	const comment = (
		await db
			.insert(commentsTable)
			.values({ videoId: params.video_id, creator: authenticatedUserId, content })
			.returning()
	)[0];

	return json({ comment });
}
