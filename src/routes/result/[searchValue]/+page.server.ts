import { db } from '$lib/db';
import { videosTable } from '$lib/db/schema';
import { and, eq } from 'drizzle-orm';

export const load = async ({ params }) => {
	// TODO: fuzzy search
	const videos = await db.select().from(videosTable).where(and(eq(videosTable.privacy, 'public'), eq(videosTable.name, params.searchValue)));

	return { videos };
};