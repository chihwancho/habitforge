import { supabase } from '../providers/supabaseProvider'
import { badgeRepository } from '../repositories/badgeRepository'
import { UserBadge } from '../types'

interface BadgeCheckContext {
  event: 'habit_completed' | 'xp_gained'
  streak?: number
  habitId?: string
}

export const badgeService = {
  async getUserBadges(userId: string): Promise<UserBadge[]> {
    return badgeRepository.getUserBadges(userId)
  },

  // Delegates to the check-badges Edge Function which runs server-side
  // with the service role key — atomic and bypasses RLS safely.
  async checkAndAward(userId: string, ctx: BadgeCheckContext): Promise<string[]> {
    const { data, error } = await supabase.functions.invoke('check-badges', {
      body: { userId, streak: ctx.streak, habitId: ctx.habitId },
    })
    if (error) {
      console.error('[badgeService] check-badges error:', error)
      return []
    }
    return (data?.badgesEarned ?? []).map((b: { name: string }) => b.name)
  },
}
