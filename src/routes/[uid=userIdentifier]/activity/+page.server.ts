import { db } from '$lib/db';
import { postsTable, videosTable } from '$lib/db/schema';
import { desc, eq } from 'drizzle-orm';

export async function load({ parent }) {
	const { user } = await parent();
	const result = await db
		.select()
		.from(postsTable)
		.innerJoin(videosTable, eq(videosTable.id, postsTable.videoId))
		.where(eq(postsTable.creator, user.id))
		.orderBy(desc(postsTable.createdAt));
	const posts = result.map((r) => ({
		...r.posts,
		video: r.videos
	}));

	return { posts };
}
