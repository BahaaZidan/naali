import { CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_STREAM_API_TOKEN } from '$env/static/private';
import { videosTable } from '$lib/db/schema';
import { error, fail } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import { db } from '$lib/db';
import * as v from 'valibot';
import { videoCountQuery } from '$lib/db/queries-and-mappers';

export const actions = {
	delete: async ({ locals, request }) => {
		const formData = await request.formData();
		const idInput = formData.get('id')?.toString();
		const parsedInput = v.safeParse(v.string([v.minLength(1), v.maxLength(32)]), idInput);
		if (!parsedInput.success) {
			return fail(400, { errors: v.flatten(parsedInput.error) });
		}
		const id = parsedInput.output;

		const session = await locals.auth();
		const logged_in_user_id = session?.user?.id;
		if (!logged_in_user_id) return fail(401);

		const deletion = await db
			.delete(videosTable)
			.where(and(eq(videosTable.id, id), eq(videosTable.creator, logged_in_user_id)));
		if (!deletion) return fail(500);

		const endpoint = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/stream/${id}`;
		const response = await fetch(endpoint, {
			method: 'DELETE',
			headers: {
				Authorization: `bearer ${CLOUDFLARE_STREAM_API_TOKEN}`
			}
		});

		if (response.status !== 200) return fail(500);

		return { success: true };
	}
};

export const load = async ({ locals }) => {
	const session = await locals.auth();
	const user = session?.user;
	if (!user?.id) return error(401);

	const count = (await videoCountQuery(user.id))[0].value as number;

	return {
		count,
		authenticatedUserId: user.id
	};
};
