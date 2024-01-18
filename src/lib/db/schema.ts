import { integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';
import type { AdapterAccount } from '@auth/core/adapters';
import { sql } from 'drizzle-orm';

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

export const videos_table = sqliteTable('videos', {
	id: text('id').primaryKey(),
	creator: text('creator')
		.notNull()
		.references(() => usersTable.id, { onDelete: 'cascade' }),
	name: text('name').notNull(),
	description: text('description'),
	created_at: text('created_at').default(sql`CURRENT_TIMESTAMP`),
	publish_status: text('publish_status', { enum: ['public', 'private'] }).default('public')
});

export const posts_table = sqliteTable('posts', {
	id: text('id').primaryKey(),
	created_at: text('created_at').default(sql`CURRENT_TIMESTAMP`),
	type: text('type', { enum: ['video'] }).default('video'),
	caption: text('caption'),
	creator: text('creator')
		.notNull()
		.references(() => usersTable.id, { onDelete: 'cascade' }),
	video_id: text('video_id')
		.notNull()
		.references(() => videos_table.id, { onDelete: 'cascade' })
});

export const follows_table = sqliteTable(
	'follows',
	{
		follower: text('follower')
			.notNull()
			.references(() => usersTable.id, { onDelete: 'cascade' }),
		followed: text('followed')
			.notNull()
			.references(() => usersTable.id, { onDelete: 'cascade' })
	},
	(t) => ({
		unq: uniqueIndex('follower_followed').on(t.follower, t.followed)
	})
);
