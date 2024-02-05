import { alias } from 'drizzle-orm/pg-core';
import { followsTable, postsTable, usersTable, videosTable } from '$lib/db/schema';
import { db } from '$lib/db';
import { count, desc, eq } from 'drizzle-orm';
import { PUBLIC_CLOUDFLARE_STREAM_CUSTOMER_CODE } from '$env/static/public';
import { streamSignedUrl } from '$lib/utils/tokens';

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
export const postsFeedMapper = async (p: Awaited<ReturnType<typeof postsFeedQuery>>[number]) => {
	const token = p.videos?.id && (await streamSignedUrl(p.videos.id));
	return {
		id: p.posts?.id,
		creator: p.postCreator,
		video: {
			...p.videos,
			creator: p.videoCreator,
			thumbnail: `https://customer-${PUBLIC_CLOUDFLARE_STREAM_CUSTOMER_CODE}.cloudflarestream.com/${token}/thumbnails/thumbnail.jpg`
		},
		createdAt: p.posts?.createdAt
	};
};

export const videoCountQuery = (userId: string) =>
	db.select({ value: count() }).from(videosTable).where(eq(videosTable.creator, userId));
export const videosInProfileQuery = (userId: string) =>
	db
		.select()
		.from(videosTable)
		.where(eq(videosTable.creator, userId))
		.orderBy(desc(videosTable.createdAt));
export const videosInProfileMapper = async (
	v: Awaited<ReturnType<typeof videosInProfileQuery>>[number]
) => {
	const token = await streamSignedUrl(v.id);
	return {
		...v,
		thumbnail: `https://customer-${PUBLIC_CLOUDFLARE_STREAM_CUSTOMER_CODE}.cloudflarestream.com/${token}/thumbnails/thumbnail.jpg`
	};
};
