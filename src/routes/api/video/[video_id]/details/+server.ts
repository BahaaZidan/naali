import { CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_STREAM_API_TOKEN } from '$env/static/private';
import { error, json } from '@sveltejs/kit';

export async function GET({ locals, params }) {
	const session = await locals.getSession();
	const authenticatedUserId = session?.user?.id;
	if (!authenticatedUserId) return error(401);

	const endpoint = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/stream/${params.video_id}`;

	const response = await fetch(endpoint, {
		method: 'GET',
		headers: {
			Authorization: `bearer ${CLOUDFLARE_STREAM_API_TOKEN}`
		}
	});

	const video_details = await response.json();
	if (!video_details.success) return error(500);

	return json({
		status: video_details.result?.status.state,
		duration: video_details.result?.duration
	});
}
