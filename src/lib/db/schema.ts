import {
	timestamp,
	pgTable,
	text,
	primaryKey,
	integer,
	real,
	uniqueIndex,
	pgEnum,
	boolean
} from 'drizzle-orm/pg-core';
import type { AdapterAccount } from '@auth/core/adapters';

export const usersTable = pgTable('user', {
	id: text('id').notNull().primaryKey(),
	name: text('name'),
	email: text('email').notNull(),
	emailVerified: timestamp('emailVerified', { mode: 'date' }),
	image: text('image')
});

export const accountsTable = pgTable(
	'account',
	{
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
		session_state: text('session_state')
	},
	(account) => ({
		compoundKey: primaryKey({ columns: [account.provider, account.providerAccountId] })
	})
);

export const sessionsTable = pgTable('session', {
	sessionToken: text('sessionToken').notNull().primaryKey(),
	userId: text('userId')
		.notNull()
		.references(() => usersTable.id, { onDelete: 'cascade' }),
	expires: timestamp('expires', { mode: 'date' }).notNull()
});

export const verificationTokensTable = pgTable(
	'verificationToken',
	{
		identifier: text('identifier').notNull(),
		token: text('token').notNull(),
		expires: timestamp('expires', { mode: 'date' }).notNull()
	},
	(vt) => ({
		compoundKey: primaryKey({ columns: [vt.identifier, vt.token] })
	})
);

export const privacyEnum = pgEnum('privacy', ['public', 'private']);

export const videosTable = pgTable('videos', {
	id: text('id').primaryKey(),
	createdAt: timestamp('createdAt').defaultNow(),
	creator: text('creator')
		.notNull()
		.references(() => usersTable.id, { onDelete: 'cascade' }),
	name: text('name').notNull(),
	description: text('description'),
	privacy: privacyEnum('privacy').default('public'),
	duration: real('duration').notNull().default(0)
});

export const postsTable = pgTable('posts', {
	id: text('id').primaryKey(),
	createdAt: timestamp('createdAt').defaultNow(),
	type: text('type', { enum: ['video'] }).default('video'),
	caption: text('caption'),
	creator: text('creator')
		.notNull()
		.references(() => usersTable.id, { onDelete: 'cascade' }),
	videoId: text('videoId')
		.notNull()
		.references(() => videosTable.id, { onDelete: 'cascade' })
});

export const followsTable = pgTable(
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

export const likesTable = pgTable(
	'likes',
	{
		liker: text('liker')
			.notNull()
			.references(() => usersTable.id, { onDelete: 'cascade' }),
		videoId: text('videoId')
			.notNull()
			.references(() => videosTable.id, { onDelete: 'cascade' }),
		value: boolean('value').notNull()
	},
	(t) => ({
		compoundKey: primaryKey({ columns: [t.liker, t.videoId] })
	})
);
