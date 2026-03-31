import { supabase } from '../providers/supabaseProvider'
import type { Badge, BadgeCriteria, UserBadge } from '../types'

function mapBadge(row: any): Badge {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    iconUrl: row.icon_url ?? null,
    badgeType: row.badge_type,
    badgePointValue: row.badge_point_value,
    isSpecialChallenge: row.is_special_challenge,
    createdAt: row.created_at,
  }
}

function mapCriteria(row: any): BadgeCriteria {
  return {
    id: row.id,
    badgeId: row.badge_id,
    criteriaType: row.criteria_type,
    targetValue: row.target_value,
    habitId: row.habit_id ?? null,
  }
}

function mapUserBadge(row: any): UserBadge & { badge?: Badge } {
  return {
    id: row.id,
    userId: row.user_id,
    badgeId: row.badge_id,
    earnedAt: row.earned_at,
    earnedContext: row.earned_context ?? null,
    badge: row.badge ? mapBadge(row.badge) : undefined,
  }
}

export const badgeRepository = {
  async getAllBadges(): Promise<Badge[]> {
    const { data, error } = await supabase
      .from('badges').select('*').order('badge_point_value', { ascending: true })
    if (error) throw error
    return (data ?? []).map(mapBadge)
  },

  async getCriteriaForBadge(badgeId: string): Promise<BadgeCriteria[]> {
    const { data, error } = await supabase
      .from('badge_criteria').select('*').eq('badge_id', badgeId)
    if (error) throw error
    return (data ?? []).map(mapCriteria)
  },

  async getUserBadges(userId: string): Promise<(UserBadge & { badge?: Badge })[]> {
    const { data, error } = await supabase
      .from('user_badges').select('*, badge:badges(*)')
      .eq('user_id', userId).order('earned_at', { ascending: false })
    if (error) throw error
    return (data ?? []).map(mapUserBadge)
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
      .insert({
        user_id: userId, badge_id: badgeId,
        earned_at: new Date().toISOString(), earned_context: context,
      })
      .select('*, badge:badges(*)').single()
    if (error) throw error
    return mapUserBadge(data)
  },
}
