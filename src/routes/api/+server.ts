import { get_db } from '$lib/db';
import { usersTable } from '$lib/db/schema';
import { json } from '@sveltejs/kit';

export const GET = async ({ locals }) => {
	const db = get_db(locals.DB);
	const result = await db.select().from(usersTable).all();
	return json({ result });
};
