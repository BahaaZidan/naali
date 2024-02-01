import { db } from '$lib/db';
import { postsTable } from '$lib/db/schema';
import { desc, eq } from 'drizzle-orm';

export async function load({ parent }) {
	const { user } = await parent();
	const posts = await db
		.select()
		.from(postsTable)
		.where(eq(postsTable.creator, user.id))
		.orderBy(desc(postsTable.createdAt));
	return { posts };
}
