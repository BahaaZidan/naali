import { CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_STREAM_API_TOKEN } from '$env/static/private';
import type { Result, VideoDetails } from '$lib/types/cloudflare';
import { error } from '@sveltejs/kit';

export const load = async ({ params }) => {
	const token_endpoint = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/stream/${params.video_id}/token`;
	const token_result = await (
		await fetch(token_endpoint, {
			method: 'POST',
			headers: {
				Authorization: `bearer ${CLOUDFLARE_STREAM_API_TOKEN}`
			}
		})
	).json<
		Result<{
			token: string;
		}>
	>();

	const token = token_result.result?.token;

	if (!token) return error(404);

	const details_endpoint = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/stream/${params.video_id}`;

	const video_result = await (
		await fetch(details_endpoint, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `bearer ${CLOUDFLARE_STREAM_API_TOKEN}`
			}
		})
	).json<Result<VideoDetails>>();

	if (!video_result.result) return error(404);

	return {
		video: video_result.result,
		token
	};
};
