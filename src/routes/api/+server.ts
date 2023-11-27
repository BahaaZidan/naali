import { usersTable } from '$lib/db/schema.js';
import { json } from '@sveltejs/kit';
import { drizzle } from 'drizzle-orm/d1';

export const GET = async ({ locals }) => {
	// const das = await locals.DB.exec('select * from Customers;');
	const db = drizzle(locals.DB);
	const result = await db.select().from(usersTable).all();
	return json({ result });
};
