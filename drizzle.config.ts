import 'dotenv/config';
import type { Config } from 'drizzle-kit';

export default {
	schema: './src/lib/db/schema.ts',
	driver: 'pg',
	dbCredentials: {
		connectionString: 'postgresql://localhost:5432/naali_local'
	},
	verbose: true,
	strict: true
} satisfies Config;
