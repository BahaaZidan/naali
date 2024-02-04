import { error, json } from '@sveltejs/kit';
import { db } from '$lib/db';
import { commentsTable } from '$lib/db/schema';
import { and, eq } from 'drizzle-orm';
import * as v from 'valibot';

export async function DELETE({ params, locals }) {
	const session = await locals.auth();
	const authenticatedUserId = session?.user?.id;
	if (!authenticatedUserId) return error(401);

	await db
		.delete(commentsTable)
		.where(
			and(eq(commentsTable.creator, authenticatedUserId), eq(commentsTable.id, params.comment_id))
		);

	return json({ success: true });
}

export async function PUT({ params, locals, request }) {
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
			.update(commentsTable)
			.set({ content })
			.where(
				and(eq(commentsTable.creator, authenticatedUserId), eq(commentsTable.id, params.comment_id))
			)
			.returning()
	)[0];

	return json({ comment });
}
