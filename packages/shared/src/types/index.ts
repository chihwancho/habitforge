// ─── User ────────────────────────────────────────────────────────────────────

export interface User {
  id: string
  username: string
  email: string
  totalXP: number
  level: number
  badgePoints: number
  avatarUrl?: string
  themeId?: string
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
  description?: string
  frequencyType: FrequencyType
  frequencyValue: number
  scheduledDays: DayOfWeek[]
  difficultyTier: DifficultyTier
  baseXP: number
  isActive: boolean
  isArchived: boolean
  currentStreak: number
  longestStreak: number
  startDate: string
  endDate?: string
  createdAt: string
}

export interface HabitLog {
  id: string
  habitId: string
  userId: string
  completedAt: string
  xpEarned: number
  streakMultiplier: number
  note?: string
}

export type CreateHabitInput = Omit<
  Habit,
  'id' | 'userId' | 'isArchived' | 'currentStreak' | 'longestStreak' | 'createdAt'
>

// ─── Badges ──────────────────────────────────────────────────────────────────

export type BadgeType = 'streak' | 'completions' | 'challenge'
export type BadgeCriteriaType = 'streak_milestone' | 'total_completions' | 'special_challenge'

export interface Badge {
  id: string
  name: string
  description: string
  iconUrl: string
  badgeType: BadgeType
  badgePointValue: number
  isSpecialChallenge: boolean
  createdAt: string
}

export interface BadgeCriteria {
  id: string
  badgeId: string
  criteriaType: BadgeCriteriaType
  targetValue: number
  habitId?: string
}

export interface UserBadge {
  id: string
  userId: string
  badgeId: string
  earnedAt: string
  earnedContext?: string
  badge?: Badge
}

// ─── Rewards ─────────────────────────────────────────────────────────────────

export type RewardType = 'custom' | 'cosmetic'

export interface Reward {
  id: string
  userId: string
  name: string
  description?: string
  badgePointCost: number
  rewardType: RewardType
  cosmeticAssetUrl?: string
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

export type CreateRewardInput = Omit<Reward, 'id' | 'userId' | 'createdAt'>

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
