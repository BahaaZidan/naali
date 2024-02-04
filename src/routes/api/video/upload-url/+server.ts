import { CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_STREAM_API_TOKEN } from '$env/static/private';
import { error } from '@sveltejs/kit';

export async function POST({ request, locals }) {
	const session = await locals.auth();
	const authenticatedUserId = session?.user?.id;
	if (!authenticatedUserId) return error(401);

	const endpoint = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/stream?direct_user=true`;
	const length = request.headers.get('Upload-Length');
	const metadata = request.headers.get('Upload-Metadata');

	if (!length || !metadata) return error(400);

	const response = await fetch(endpoint, {
		method: 'POST',
		headers: {
			Authorization: `bearer ${CLOUDFLARE_STREAM_API_TOKEN}`,
			'Tus-Resumable': '1.0.0',
			'Upload-Length': length,
			'Upload-Metadata': metadata,
			'Upload-Creator': authenticatedUserId
		}
	});

	const destination = response.headers.get('Location');

	if (!destination) return error(500);

	return new Response(null, {
		headers: {
			'Access-Control-Expose-Headers': 'Location',
			'Access-Control-Allow-Headers': '*',
			'Access-Control-Allow-Origin': '*',
			Location: destination
		}
	});
}
