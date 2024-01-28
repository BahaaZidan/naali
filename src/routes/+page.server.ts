import { PUBLIC_CLOUDFLARE_STREAM_CUSTOMER_CODE } from '$env/static/public';
import { followsTable, postsTable, usersTable, videosTable } from '$lib/db/schema';
import { desc, eq } from 'drizzle-orm';
import { db } from '$lib/db';
import { alias } from 'drizzle-orm/pg-core';

export const load = async ({ locals }) => {
	const session = await locals.getSession();
	const logged_in_user_id = session?.user?.id;

	if (!logged_in_user_id) return {};

	const postCreator = alias(usersTable, 'postCreator');
	const videoCreator = alias(usersTable, 'videoCreator');
	const postsResult = await db
		.select()
		.from(postsTable)
		.innerJoin(followsTable, eq(postsTable.creator, followsTable.followed))
		.rightJoin(videosTable, eq(videosTable.id, postsTable.videoId))
		.rightJoin(postCreator, eq(postCreator.id, postsTable.creator))
		.rightJoin(videoCreator, eq(videoCreator.id, videosTable.creator))
		.where(eq(followsTable.follower, logged_in_user_id))
		.orderBy(desc(postsTable.createdAt));

	const posts = postsResult.map((p) => ({
		id: p.posts?.id,
		creator: p.postCreator,
		video: {
			...p.videos,
			creator: p.videoCreator,
			thumbnail: `https://customer-${PUBLIC_CLOUDFLARE_STREAM_CUSTOMER_CODE}.cloudflarestream.com/${p.videos?.id}/thumbnails/thumbnail.jpg`
		},
		caption: p.posts?.caption,
		createdAt: p.posts?.createdAt
	}));
	return { posts };
};
