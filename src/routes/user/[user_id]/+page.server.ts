import { get_db } from '$lib/db';
import { usersTable } from '$lib/db/schema.js';
import { error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const load = async ({ params, locals }) => {
	const db = get_db(locals.DB);
	const result = await db.select().from(usersTable).where(eq(usersTable.id, params.user_id));
	const user = result[0];

	if (!user) return error(404);

	return {
		user
	};
};
