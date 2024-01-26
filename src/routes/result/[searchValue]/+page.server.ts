import { db } from '$lib/db';
import { videosTable } from '$lib/db/schema';
import { and, eq, ilike } from 'drizzle-orm';

export const load = async ({ params }) => {
	// TODO: use a search index
	const videos = await db.select().from(videosTable).where(and(eq(videosTable.privacy, 'public'), ilike(videosTable.name, `%${params.searchValue}%`)));

	return { videos };
};