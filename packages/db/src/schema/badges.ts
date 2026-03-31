import { boolean, integer, pgTable, text, timestamp, unique, uuid } from 'drizzle-orm/pg-core'
import { users } from './users'
import { habits } from './habits'

export const badges = pgTable('badges', {
  id:                 uuid('id').defaultRandom().primaryKey(),
  name:               text('name').notNull().unique(),
  description:        text('description').notNull(),
  iconUrl:            text('icon_url'),
  badgeType:          text('badge_type').notNull(),
  badgePointValue:    integer('badge_point_value').notNull().default(5),
  isSpecialChallenge: boolean('is_special_challenge').notNull().default(false),
  createdAt:          timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export const badgeCriteria = pgTable('badge_criteria', {
  id:           uuid('id').defaultRandom().primaryKey(),
  badgeId:      uuid('badge_id').notNull().references(() => badges.id, { onDelete: 'cascade' }),
  criteriaType: text('criteria_type').notNull(),
  targetValue:  integer('target_value').notNull(),
  habitId:      uuid('habit_id').references(() => habits.id, { onDelete: 'set null' }),
})

export const userBadges = pgTable('user_badges', {
  id:            uuid('id').defaultRandom().primaryKey(),
  userId:        uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  badgeId:       uuid('badge_id').notNull().references(() => badges.id, { onDelete: 'cascade' }),
  earnedAt:      timestamp('earned_at', { withTimezone: true }).notNull().defaultNow(),
  earnedContext: text('earned_context'),
}, (table) => ({
  uniq: unique().on(table.userId, table.badgeId),
}))

export type Badge = typeof badges.$inferSelect
export type BadgeCriteria = typeof badgeCriteria.$inferSelect
export type UserBadge = typeof userBadges.$inferSelect
export type NewUserBadge = typeof userBadges.$inferInsert
