import 'unplugin-icons/types/svelte';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			DB: D1Database;
		}
		// interface PageData {}
		interface Platform {
			env: {
				// KV: KVNamespace;
				DB: D1Database;
				// BUCKET: R2Bucket;
			};
		}
	}
}

export {};
