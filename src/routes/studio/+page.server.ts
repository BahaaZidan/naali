import { usersTable } from '$lib/db/schema';
import { error, fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { db } from '$lib/db';
import * as v from 'valibot';
import sharp from 'sharp';
import { s3 } from '$lib/s3-client';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { PUBLIC_R2_BUCKET_NAME, PUBLIC_R2_PUBLIC_ACCESS_URL } from '$env/static/public';

export const actions = {
	default: async ({ locals, request }) => {
		const formData = await request.formData();
		// WORKAROUND: escape the empty File object
		const pictureFormData = formData.get('picture');
		if (pictureFormData instanceof File && pictureFormData.size === 0) formData.delete('picture');

		const schema = v.object({
			name: v.string([v.toTrimmed(), v.minLength(1), v.maxLength(20)]),
			handle: v.string([
				v.toTrimmed(),
				v.minLength(1),
				v.maxLength(16),
				v.toLowerCase(),
				v.regex(/^[a-z0-9_]+$/, 'Handle can only contain english letters, numbers, or underscores')
			]),
			picture: v.optional(
				v.instance(File, [v.maxSize(10 * 1024 * 1024), v.mimeType(['image/jpeg', 'image/png'])])
			)
		});
		const validationResult = v.safeParse(schema, Object.fromEntries(formData.entries()));
		if (!validationResult.success) {
			return fail(400, { errors: v.flatten(validationResult.error) });
		}

		const session = await locals.auth();
		const logged_in_user_id = session?.user?.id;
		if (!logged_in_user_id) return fail(401);

		let image: string | undefined;
		const picture = validationResult.output.picture;
		if (picture) {
			const buffer = await picture.arrayBuffer();
			const Body = await sharp(buffer)
				.resize({ width: 460 })
				.webp({ preset: 'picture', quality: 50 })
				.toBuffer();

			const Key = `${crypto.randomUUID()}.webp`;
			const putCommandResult = await s3.send(
				new PutObjectCommand({
					Key,
					Body,
					Bucket: PUBLIC_R2_BUCKET_NAME,
					ContentType: 'image/webp'
				})
			);
			if (putCommandResult.$metadata.httpStatusCode === 200)
				image = `${PUBLIC_R2_PUBLIC_ACCESS_URL}/${Key}`;
		}

		const formValues = validationResult.output;
		const insertion = await db
			.update(usersTable)
			.set({ name: formValues.name, handle: formValues.handle, image })
			.where(eq(usersTable.id, logged_in_user_id));
		if (!insertion) return fail(500);

		return { success: true };
	}
};

export const load = async ({ locals }) => {
	const session = await locals.auth();
	const user_id = session?.user?.id;
	if (!user_id) return error(404);

	const user = (await db.select().from(usersTable).where(eq(usersTable.id, user_id)))[0];
	if (!user) return error(404);

	return { user };
};
