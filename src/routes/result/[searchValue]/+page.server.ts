import { db } from '$lib/db';
import { videosTable } from '$lib/db/schema';
import { ilike } from 'drizzle-orm';

export const load = async ({ params }) => {
	// TODO: use a search index
	const videos = await db
		.select()
		.from(videosTable)
		.where(ilike(videosTable.name, `%${params.searchValue}%`));

	return { videos };
};
