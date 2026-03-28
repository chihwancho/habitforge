import { supabase } from '../providers/supabaseProvider'
import { Badge, BadgeCriteria, UserBadge } from '../types'

export const badgeRepository = {
  async getAllBadges(): Promise<Badge[]> {
    const { data, error } = await supabase
      .from('badges').select('*').order('badge_point_value', { ascending: true })
    if (error) throw error
    return data ?? []
  },

  async getCriteriaForBadge(badgeId: string): Promise<BadgeCriteria[]> {
    const { data, error } = await supabase
      .from('badge_criteria').select('*').eq('badge_id', badgeId)
    if (error) throw error
    return data ?? []
  },

  async getUserBadges(userId: string): Promise<UserBadge[]> {
    const { data, error } = await supabase
      .from('user_badges').select('*, badge:badges(*)')
      .eq('user_id', userId).order('earned_at', { ascending: false })
    if (error) throw error
    return data ?? []
  },

  async hasEarned(userId: string, badgeId: string): Promise<boolean> {
    const { count, error } = await supabase
      .from('user_badges').select('*', { count: 'exact', head: true })
      .eq('user_id', userId).eq('badge_id', badgeId)
    if (error) throw error
    return (count ?? 0) > 0
  },

  async award(userId: string, badgeId: string, context?: string): Promise<UserBadge> {
    const { data, error } = await supabase
      .from('user_badges')
      .insert({ user_id: userId, badge_id: badgeId, earned_at: new Date().toISOString(), earned_context: context })
      .select('*, badge:badges(*)').single()
    if (error) throw error
    return data
  },
}
