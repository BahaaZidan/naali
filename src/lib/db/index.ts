import { drizzle } from 'drizzle-orm/d1';
import * as schema from './schema';

export const get_db = (client: D1Database) =>
	drizzle(client, {
		schema
		// TODO: implement a logger ?
	});
