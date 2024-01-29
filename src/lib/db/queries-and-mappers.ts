import { alias } from 'drizzle-orm/pg-core';
import { followsTable, postsTable, usersTable, videosTable } from '$lib/db/schema';
import { db } from '$lib/db';
import { desc, eq } from 'drizzle-orm';
import { PUBLIC_CLOUDFLARE_STREAM_CUSTOMER_CODE } from '$env/static/public';

const postCreator = alias(usersTable, 'postCreator');
const videoCreator = alias(usersTable, 'videoCreator');
export const postsFeedQuery = (logged_in_user_id: string) =>
	db
		.select()
		.from(postsTable)
		.innerJoin(followsTable, eq(postsTable.creator, followsTable.followed))
		.rightJoin(videosTable, eq(videosTable.id, postsTable.videoId))
		.rightJoin(postCreator, eq(postCreator.id, postsTable.creator))
		.rightJoin(videoCreator, eq(videoCreator.id, videosTable.creator))
		.where(eq(followsTable.follower, logged_in_user_id))
		.orderBy(desc(postsTable.createdAt));

export const postsFeedMapper = (p: Awaited<ReturnType<typeof postsFeedQuery>>) => ({
	id: p.posts?.id,
	creator: p.postCreator,
	video: {
		...p.videos,
		creator: p.videoCreator,
		thumbnail: `https://customer-${PUBLIC_CLOUDFLARE_STREAM_CUSTOMER_CODE}.cloudflarestream.com/${p.videos?.id}/thumbnails/thumbnail.jpg`
	},
	caption: p.posts?.caption,
	createdAt: p.posts?.createdAt
});

export type MappedPost = ReturnType<typeof postsFeedMapper>;
