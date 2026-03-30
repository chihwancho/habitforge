import { supabase } from '../providers/supabaseProvider'
import { CreateRewardInput, Reward, RewardRedemption, User } from '../types'

export const userRepository = {
  async getById(userId: string): Promise<User> {
    const { data, error } = await supabase
      .from('users').select('*').eq('id', userId).single()
    if (error) throw error
    return data
  },

  async addXP(userId: string, xpToAdd: number): Promise<User> {
    const { data, error } = await supabase.functions.invoke('add-xp', {
      body: { userId, xpToAdd },
    })
    if (error) throw error
    return data.user
  },

  async deductBadgePoints(userId: string, points: number): Promise<User> {
    const { data, error } = await supabase.functions.invoke('deduct-badge-points', {
      body: { userId, points },
    })
    if (error) throw error
    return data.user
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
    return data ?? []
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
      .select()
      .single()
    if (error) throw error
    return data
  },

  async redeem(userId: string, rewardId: string, pointsSpent: number): Promise<RewardRedemption> {
    const { data, error } = await supabase
      .from('reward_redemptions')
      .insert({ user_id: userId, reward_id: rewardId, redeemed_at: new Date().toISOString(), points_spent: pointsSpent })
      .select().single()
    if (error) throw error
    return data
  },

  async getRedemptions(userId: string): Promise<RewardRedemption[]> {
    const { data, error } = await supabase
      .from('reward_redemptions').select('*')
      .eq('user_id', userId).order('redeemed_at', { ascending: false })
    if (error) throw error
    return data ?? []
  },
}
