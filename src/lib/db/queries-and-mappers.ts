import { alias } from 'drizzle-orm/pg-core';
import { followsTable, postsTable, usersTable, videosTable } from '$lib/db/schema';
import { db } from '$lib/db';
import { count, desc, eq } from 'drizzle-orm';
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
export const postsFeedMapper = (p: Awaited<ReturnType<typeof postsFeedQuery>>[number]) => ({
	id: p.posts?.id,
	creator: p.postCreator,
	video: {
		...p.videos,
		creator: p.videoCreator,
		thumbnail: `https://customer-${PUBLIC_CLOUDFLARE_STREAM_CUSTOMER_CODE}.cloudflarestream.com/${p.videos?.id}/thumbnails/thumbnail.jpg`
	},
	createdAt: p.posts?.createdAt
});

export const videoCountQuery = (userId: string) =>
	db.select({ value: count() }).from(videosTable).where(eq(videosTable.creator, userId));
export const videosInProfileQuery = (userId: string) =>
	db
		.select()
		.from(videosTable)
		.where(eq(videosTable.creator, userId))
		.orderBy(desc(videosTable.createdAt));
export const videosInProfileMapper = (
	v: Awaited<ReturnType<typeof videosInProfileQuery>>[number]
) => ({
	...v,
	thumbnail: `https://customer-${PUBLIC_CLOUDFLARE_STREAM_CUSTOMER_CODE}.cloudflarestream.com/${v.id}/thumbnails/thumbnail.jpg`
});
