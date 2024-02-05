import {
	CLOUDFLARE_STREAM_TOKEN_GEN_KEY_ID,
	CLOUDFLARE_STREAM_TOKEN_JWK
} from '$env/static/private';

const expiresTimeInSeconds = 3600;

export async function streamSignedUrl(videoUID: string) {
	const encoder = new TextEncoder();
	const expiresIn = Math.floor(Date.now() / 1000) + expiresTimeInSeconds;
	const headers = {
		alg: 'RS256',
		kid: CLOUDFLARE_STREAM_TOKEN_GEN_KEY_ID
	};
	const data = {
		sub: videoUID,
		kid: CLOUDFLARE_STREAM_TOKEN_GEN_KEY_ID,
		exp: expiresIn
	};

	const token = `${objectToBase64url(headers)}.${objectToBase64url(data)}`;

	const jwk = JSON.parse(atob(CLOUDFLARE_STREAM_TOKEN_JWK));

	const key = await crypto.subtle.importKey(
		'jwk',
		jwk,
		{
			name: 'RSASSA-PKCS1-v1_5',
			hash: 'SHA-256'
		},
		false,
		['sign']
	);

	const signature = await crypto.subtle.sign(
		{ name: 'RSASSA-PKCS1-v1_5' },
		key,
		encoder.encode(token)
	);

	return `${token}.${arrayBufferToBase64Url(signature)}`;
}

function arrayBufferToBase64Url(buffer: ArrayBuffer) {
	return btoa(String.fromCharCode(...new Uint8Array(buffer)))
		.replace(/=/g, '')
		.replace(/\+/g, '-')
		.replace(/\//g, '_');
}

function objectToBase64url(payload: object) {
	return arrayBufferToBase64Url(new TextEncoder().encode(JSON.stringify(payload)));
}
