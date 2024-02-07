import { S3Client } from '@aws-sdk/client-s3';
import { R2_ACCESS_KEY_ID, R2_S3_ENDPOINT, R2_SECRET_ACCESS_KEY } from '$env/static/private';

export const s3 = new S3Client({
	region: 'auto',
	endpoint: R2_S3_ENDPOINT,
	credentials: {
		accessKeyId: R2_ACCESS_KEY_ID,
		secretAccessKey: R2_SECRET_ACCESS_KEY
	}
});
