import type { ParamMatcher } from '@sveltejs/kit';
import * as v from 'valibot';

export const match: ParamMatcher = (param) => {
	const handleSchema = v.string([
		v.minLength(1),
		v.maxLength(16),
		v.toLowerCase(),
		v.regex(/^[a-z0-9_]+$/)
	]);
	if (v.safeParse(handleSchema, param).success) return true;

	const uuidSchema = v.string([v.uuid()]);
	return v.safeParse(uuidSchema, param).success;
};
