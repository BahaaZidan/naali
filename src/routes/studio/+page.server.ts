import { usersTable } from '$lib/db/schema';
import { error, fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { db } from '$lib/db';
import * as v from 'valibot';

export const actions = {
	default: async ({ locals, request }) => {
		const formData = await request.formData();
		const schema = v.object({
			name: v.string([v.toTrimmed(), v.minLength(1), v.maxLength(20)]),
			handle: v.string([
				v.toTrimmed(),
				v.minLength(1),
				v.maxLength(16),
				v.toLowerCase(),
				v.regex(/^[a-z0-9_]+$/, 'Handle can only contain english letters, numbers, or underscores')
			])
		});
		const validationResult = v.safeParse(schema, Object.fromEntries(formData.entries()));
		if (!validationResult.success) {
			return fail(400, { errors: v.flatten(validationResult.error) });
		}

		const session = await locals.getSession();
		const logged_in_user_id = session?.user?.id;
		if (!logged_in_user_id) return fail(401);

		const formValues = validationResult.output;
		const insertion = await db
			.update(usersTable)
			.set({ name: formValues.name, handle: formValues.handle })
			.where(eq(usersTable.id, logged_in_user_id));
		if (!insertion) return fail(500);

		return { success: true };
	}
};

export const load = async ({ locals }) => {
	const session = await locals.getSession();
	const user_id = session?.user?.id;
	if (!user_id) return error(404);

	const user = (await db.select().from(usersTable).where(eq(usersTable.id, user_id)))[0];
	if (!user) return error(404);

	return { user };
};
