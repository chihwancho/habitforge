import { supabase } from '../providers/supabaseProvider'
import type { User, Reward, RewardRedemption } from '../types'
import type { CreateRewardInput } from '../types'

function mapUser(row: any): User {
  return {
    id: row.id,
    username: row.username,
    email: row.email,
    totalXP: row.total_xp,
    level: row.level,
    badgePoints: row.badge_points,
    avatarUrl: row.avatar_url ?? null,
    themeId: row.theme_id ?? null,
    createdAt: row.created_at,
  }
}

function mapReward(row: any): Reward {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    description: row.description ?? null,
    badgePointCost: row.badge_point_cost,
    rewardType: row.reward_type,
    cosmeticAssetUrl: row.cosmetic_asset_url ?? null,
    isActive: row.is_active,
    createdAt: row.created_at,
  }
}

function mapRedemption(row: any): RewardRedemption {
  return {
    id: row.id,
    userId: row.user_id,
    rewardId: row.reward_id,
    redeemedAt: row.redeemed_at,
    pointsSpent: row.points_spent,
  }
}

export const userRepository = {
  async getById(userId: string): Promise<User> {
    const { data, error } = await supabase
      .from('users').select('*').eq('id', userId).single()
    if (error) throw error
    return mapUser(data)
  },

  async addXP(userId: string, xpToAdd: number): Promise<User> {
    const { data, error } = await supabase.functions.invoke('add-xp', {
      body: { userId, xpToAdd },
    })
    if (error) throw error
    return mapUser(data.user)
  },

  async deductBadgePoints(userId: string, points: number): Promise<User> {
    const { data, error } = await supabase.functions.invoke('deduct-badge-points', {
      body: { userId, points },
    })
    if (error) throw error
    return mapUser(data.user)
  },

  async updateTheme(userId: string, themeId: string): Promise<void> {
    const { error } = await supabase
      .from('users').update({ theme_id: themeId }).eq('id', userId)
    if (error) throw error
  },
}

export const rewardRepository = {
  async getAll(userId: string): Promise<Reward[]> {
    const { data, error } = await supabase
      .from('rewards').select('*')
      .eq('user_id', userId).eq('is_active', true)
      .order('badge_point_cost', { ascending: true })
    if (error) throw error
    return (data ?? []).map(mapReward)
  },

  async create(userId: string, input: CreateRewardInput): Promise<Reward> {
    const { data, error } = await supabase
      .from('rewards')
      .insert({
        user_id: userId,
        name: input.name,
        description: input.description,
        badge_point_cost: input.badgePointCost,
        reward_type: input.rewardType,
        cosmetic_asset_url: input.cosmeticAssetUrl,
        is_active: input.isActive,
      })
      .select().single()
    if (error) throw error
    return mapReward(data)
  },

  async redeem(userId: string, rewardId: string, pointsSpent: number): Promise<RewardRedemption> {
    const { data, error } = await supabase
      .from('reward_redemptions')
      .insert({
        user_id: userId, reward_id: rewardId,
        redeemed_at: new Date().toISOString(), points_spent: pointsSpent,
      })
      .select().single()
    if (error) throw error
    return mapRedemption(data)
  },

  async getRedemptions(userId: string): Promise<RewardRedemption[]> {
    const { data, error } = await supabase
      .from('reward_redemptions').select('*')
      .eq('user_id', userId).order('redeemed_at', { ascending: false })
    if (error) throw error
    return (data ?? []).map(mapRedemption)
  },
}
