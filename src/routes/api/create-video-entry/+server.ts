import { get_db } from '$lib/db/index.js';
import { posts_table, videos_table } from '$lib/db/schema.js';
import { error, json } from '@sveltejs/kit';
import { minLength, object, parse, string } from 'valibot';

export async function POST({ request, locals }) {
	const session = await locals.getSession();
	const authenticatedUserId = session?.user?.id;
	if (!authenticatedUserId) return error(401);

	const input = await request.json();
	const schema = object({
		video: object({
			// TODO: validate ids better
			id: string([minLength(1)]),
			creator: string([minLength(1)]),
			name: string([minLength(1)]),
			description: string()
		})
	});
	const validated_input = parse(schema, input);
	const video = validated_input.video;
	const post = {
		id: crypto.randomUUID(),
		video_id: video.id,
		creator: video.creator
	};
	const db = get_db(locals.DB);

	const insert_video = await db.insert(videos_table).values(video);
	const insert_post = await db.insert(posts_table).values(post);
	if (insert_video.error || insert_post.error) return error(500);

	return json(validated_input);
}
