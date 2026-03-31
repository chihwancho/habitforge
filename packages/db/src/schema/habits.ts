import { boolean, integer, numeric, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { users } from './users'

export const habits = pgTable('habits', {
  id:             uuid('id').defaultRandom().primaryKey(),
  userId:         uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name:           text('name').notNull(),
  description:    text('description'),
  frequencyType:  text('frequency_type').notNull().default('daily'),
  frequencyValue: integer('frequency_value').notNull().default(1),
  scheduledDays:  text('scheduled_days').array().notNull().default([]),
  difficultyTier: integer('difficulty_tier').notNull().default(1),
  baseXP:         integer('base_xp').notNull().default(10),
  isActive:       boolean('is_active').notNull().default(true),
  isArchived:     boolean('is_archived').notNull().default(false),
  currentStreak:  integer('current_streak').notNull().default(0),
  longestStreak:  integer('longest_streak').notNull().default(0),
  startDate:      timestamp('start_date', { withTimezone: true }).notNull().defaultNow(),
  endDate:        timestamp('end_date', { withTimezone: true }),
  createdAt:      timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export const habitLogs = pgTable('habit_logs', {
  id:               uuid('id').defaultRandom().primaryKey(),
  habitId:          uuid('habit_id').notNull().references(() => habits.id, { onDelete: 'cascade' }),
  userId:           uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  completedAt:      timestamp('completed_at', { withTimezone: true }).notNull().defaultNow(),
  xpEarned:         integer('xp_earned').notNull().default(0),
  streakMultiplier: numeric('streak_multiplier', { precision: 4, scale: 2 }).notNull().default('1.0'),
  note:             text('note'),
})

export type Habit = typeof habits.$inferSelect
export type NewHabit = typeof habits.$inferInsert
export type HabitLog = typeof habitLogs.$inferSelect
export type NewHabitLog = typeof habitLogs.$inferInsert
