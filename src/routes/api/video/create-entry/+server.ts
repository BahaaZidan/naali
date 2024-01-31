import { postsTable, videosTable } from '$lib/db/schema';
import { error, json } from '@sveltejs/kit';
import { minLength, number, object, parse, string } from 'valibot';
import { db } from '$lib/db';

export async function POST({ request, locals }) {
	const session = await locals.getSession();
	const authenticatedUserId = session?.user?.id;
	if (!authenticatedUserId) return error(401);

	const input = await request.json();
	const schema = object({
		video: object({
			id: string([minLength(32)]),
			creator: string([minLength(1)]),
			name: string([minLength(1)]),
			description: string(),
			duration: number()
		})
	});
	const validated_input = parse(schema, input);
	const video = validated_input.video;
	const post = {
		videoId: video.id,
		creator: video.creator
	};

	const insert_video = await db.insert(videosTable).values(video);
	const insert_post = await db.insert(postsTable).values(post);
	// TODO: better error handling
	if (!insert_video || !insert_post) return error(500);

	return json(validated_input);
}
