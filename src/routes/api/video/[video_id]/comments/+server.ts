import { error, json } from '@sveltejs/kit';
import { db } from '$lib/db';
import { commentsTable, usersTable } from '$lib/db/schema';
import { desc, eq } from 'drizzle-orm';
import * as v from 'valibot';

export async function GET({ params, locals }) {
	const session = await locals.auth();
	const authenticatedUserId = session?.user?.id;
	if (!authenticatedUserId) return error(401);

	const result = await db
		.select()
		.from(commentsTable)
		.innerJoin(usersTable, eq(usersTable.id, commentsTable.creator))
		.where(eq(commentsTable.videoId, params.video_id))
		.orderBy(desc(commentsTable.createdAt));
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
