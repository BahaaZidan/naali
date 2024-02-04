import { postsTable, videosTable } from '$lib/db/schema';
import { error, json } from '@sveltejs/kit';
import * as v from 'valibot';
import { db } from '$lib/db';

export async function POST({ request, locals }) {
	const session = await locals.auth();
	const authenticatedUserId = session?.user?.id;
	if (!authenticatedUserId) return error(401);

	const input = await request.json();
	const schema = v.object({
		video: v.object({
			id: v.string([v.minLength(32)]),
			creator: v.string([v.minLength(1)]),
			name: v.string([v.minLength(1)]),
			description: v.string(),
			duration: v.number(),
			createdAt: v.transform(v.string([v.isoTimestamp()]), (iso) => new Date(iso))
		})
	});
	const validated_input = v.parse(schema, input);
	const video = validated_input.video;
	const post = {
		videoId: video.id,
		creator: video.creator,
		createdAt: video.createdAt
	};

	await db.insert(videosTable).values(video);
	await db.insert(postsTable).values(post);

	return json(validated_input);
}
