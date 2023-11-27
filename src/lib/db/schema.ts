import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import type { AdapterAccount } from '@auth/core/adapters';

export const usersTable = sqliteTable('users', {
	id: text('id').notNull().primaryKey(),
	name: text('name'),
	email: text('email').notNull(),
	emailVerified: integer('emailVerified', { mode: 'timestamp_ms' }),
	image: text('image')
});

export const accountsTable = sqliteTable('accounts', {
	id: text('id').notNull().primaryKey(),
	userId: text('userId')
		.notNull()
		.references(() => usersTable.id, { onDelete: 'cascade' }),
	type: text('type').$type<AdapterAccount['type']>().notNull(),
	provider: text('provider').notNull(),
	providerAccountId: text('providerAccountId').notNull(),
	refresh_token: text('refresh_token'),
	access_token: text('access_token'),
	expires_at: integer('expires_at'),
	token_type: text('token_type'),
	scope: text('scope'),
	id_token: text('id_token'),
	session_state: text('session_state'),
	oauth_token_secret: text('oauth_token_secret'),
	oauth_token: text('oauth_token')
});

export const sessionsTable = sqliteTable('sessions', {
	id: text('id').notNull(),
	sessionToken: text('sessionToken').notNull().primaryKey(),
	userId: text('userId')
		.notNull()
		.references(() => usersTable.id, { onDelete: 'cascade' }),
	expires: integer('expires', { mode: 'timestamp_ms' }).notNull()
});

export const verificationTokensTable = sqliteTable('verification_tokens', {
	identifier: text('identifier').notNull(),
	token: text('token').notNull().primaryKey(),
	expires: integer('expires', { mode: 'timestamp_ms' }).notNull()
});
