import { boolean, integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { users } from './users'

export const rewards = pgTable('rewards', {
  id:               uuid('id').defaultRandom().primaryKey(),
  userId:           uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name:             text('name').notNull(),
  description:      text('description'),
  badgePointCost:   integer('badge_point_cost').notNull().default(10),
  rewardType:       text('reward_type').notNull().default('custom'),
  cosmeticAssetUrl: text('cosmetic_asset_url'),
  isActive:         boolean('is_active').notNull().default(true),
  createdAt:        timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export const rewardRedemptions = pgTable('reward_redemptions', {
  id:          uuid('id').defaultRandom().primaryKey(),
  userId:      uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  rewardId:    uuid('reward_id').notNull().references(() => rewards.id, { onDelete: 'cascade' }),
  redeemedAt:  timestamp('redeemed_at', { withTimezone: true }).notNull().defaultNow(),
  pointsSpent: integer('points_spent').notNull(),
})

export type Reward = typeof rewards.$inferSelect
export type NewReward = typeof rewards.$inferInsert
export type RewardRedemption = typeof rewardRedemptions.$inferSelect
export type NewRewardRedemption = typeof rewardRedemptions.$inferInsert
