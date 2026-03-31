import { boolean, pgTable, text, timestamp, uuid, integer } from 'drizzle-orm/pg-core'

export const themes = pgTable('themes', {
  id:              uuid('id').defaultRandom().primaryKey(),
  name:            text('name').notNull().unique(),
  primaryColor:    text('primary_color').notNull(),
  accentColor:     text('accent_color').notNull(),
  backgroundStyle: text('background_style').notNull(),
  isDefault:       boolean('is_default').notNull().default(false),
})

export const users = pgTable('users', {
  id:          uuid('id').primaryKey(), // references auth.users — no FK in Drizzle for cross-schema
  username:    text('username').notNull().unique(),
  email:       text('email').notNull().unique(),
  totalXP:     integer('total_xp').notNull().default(0),
  level:       integer('level').notNull().default(1),
  badgePoints: integer('badge_points').notNull().default(0),
  avatarUrl:   text('avatar_url'),
  themeId:     uuid('theme_id').references(() => themes.id, { onDelete: 'set null' }),
  createdAt:   timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type Theme = typeof themes.$inferSelect
