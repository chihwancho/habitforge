// ─── User ────────────────────────────────────────────────────────────────────

export interface User {
  id: string
  username: string
  email: string
  totalXP: number
  level: number
  badgePoints: number
  avatarUrl?: string | null
  themeId?: string | null
  createdAt: string
}

// ─── Habits ──────────────────────────────────────────────────────────────────

export type FrequencyType = 'daily' | 'weekly' | 'custom' | 'one-time'
export type DifficultyTier = 1 | 2 | 3
export type DayOfWeek = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun'

export interface Habit {
  id: string
  userId: string
  name: string
  description?: string | null
  frequencyType: FrequencyType
  frequencyValue: number
  scheduledDays: string[]
  difficultyTier: number
  baseXP: number
  isActive: boolean
  isArchived: boolean
  currentStreak: number
  longestStreak: number
  startDate: string
  endDate?: string | null
  createdAt: string
}

export interface HabitLog {
  id: string
  habitId: string
  userId: string
  completedAt: string
  xpEarned: number
  streakMultiplier: string | number
  note?: string | null
}

export type CreateHabitInput = {
  name: string
  description?: string
  frequencyType: FrequencyType
  frequencyValue: number
  scheduledDays: DayOfWeek[]
  difficultyTier: DifficultyTier
  baseXP: number
  isActive: boolean
  startDate: string
  endDate?: string
}

// ─── Badges ──────────────────────────────────────────────────────────────────

export type BadgeType = 'streak' | 'completions' | 'challenge'
export type BadgeCriteriaType = 'streak_milestone' | 'total_completions' | 'special_challenge'

export interface Badge {
  id: string
  name: string
  description: string
  iconUrl?: string | null
  badgeType: string
  badgePointValue: number
  isSpecialChallenge: boolean
  createdAt: string
}

export interface BadgeCriteria {
  id: string
  badgeId: string
  criteriaType: string
  targetValue: number
  habitId?: string | null
}

export interface UserBadge {
  id: string
  userId: string
  badgeId: string
  earnedAt: string
  earnedContext?: string | null
  badge?: Badge
}

// ─── Rewards ─────────────────────────────────────────────────────────────────

export type RewardType = 'custom' | 'cosmetic'

export interface Reward {
  id: string
  userId: string
  name: string
  description?: string | null
  badgePointCost: number
  rewardType: string
  cosmeticAssetUrl?: string | null
  isActive: boolean
  createdAt: string
}

export interface RewardRedemption {
  id: string
  userId: string
  rewardId: string
  redeemedAt: string
  pointsSpent: number
}

export type CreateRewardInput = {
  name: string
  description?: string
  badgePointCost: number
  rewardType: RewardType
  cosmeticAssetUrl?: string
  isActive: boolean
}

// ─── Themes ──────────────────────────────────────────────────────────────────

export interface Theme {
  id: string
  name: string
  primaryColor: string
  accentColor: string
  backgroundStyle: string
  isDefault: boolean
}

// ─── XP ──────────────────────────────────────────────────────────────────────

export interface XPCalculation {
  baseXP: number
  streakMultiplier: number
  difficultyMultiplier: number
  totalXP: number
}

export interface LevelInfo {
  level: number
  currentXP: number
  xpForNextLevel: number
  progressPercent: number
}

export interface ServiceResult<T> {
  data: T | null
  error: string | null
}
