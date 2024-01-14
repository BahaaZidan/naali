import { get_db } from '$lib/db/index.js';
import { videos_table } from '$lib/db/schema.js';
import { error, json } from '@sveltejs/kit';
import { minLength, object, parse, string, array } from 'valibot';

export async function POST({ request, locals }) {
	const session = await locals.getSession();
	const authenticatedUserId = session?.user?.id;
	if (!authenticatedUserId) return error(401);

	const input = await request.json();
	const schema = object({
		videos: array(
			object({
				// TODO: validate ids better
				id: string([minLength(1)]),
				creator: string([minLength(1)]),
				name: string([minLength(1)])
			})
		)
	});
	const validated_input = parse(schema, input);
	const videos = validated_input.videos;
	const db = get_db(locals.DB);

	const result = await db.insert(videos_table).values(videos);

	if (result.error) return error(500);

	return json(validated_input);
}
