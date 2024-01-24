import { usersTable } from '$lib/db/schema';
import { error, fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { db } from '$lib/db';

export const actions = {
	default: async ({ locals, request }) => {
		const formData = await request.formData();
		const name = formData.get('name')?.toString();
		if (!name) {
			return fail(400, { name, missing: true });
		}

		const session = await locals.getSession();
		const logged_in_user_id = session?.user?.id;
		if (!logged_in_user_id) return fail(401);

		const insertion = await db
			.update(usersTable)
			.set({ name })
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
