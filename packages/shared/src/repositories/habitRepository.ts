import { supabase } from '../providers/supabaseProvider'
import type { Habit, HabitLog } from '../types'
import type { CreateHabitInput } from '../types'

function mapHabit(row: any): Habit {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    description: row.description ?? null,
    frequencyType: row.frequency_type,
    frequencyValue: row.frequency_value,
    scheduledDays: row.scheduled_days ?? [],
    difficultyTier: row.difficulty_tier,
    baseXP: row.base_xp,
    isActive: row.is_active,
    isArchived: row.is_archived,
    currentStreak: row.current_streak,
    longestStreak: row.longest_streak,
    startDate: row.start_date,
    endDate: row.end_date ?? null,
    createdAt: row.created_at,
  }
}

function mapHabitLog(row: any): HabitLog {
  return {
    id: row.id,
    habitId: row.habit_id,
    userId: row.user_id,
    completedAt: row.completed_at,
    xpEarned: row.xp_earned,
    streakMultiplier: row.streak_multiplier,
    note: row.note ?? null,
  }
}

export const habitRepository = {
  async getAll(userId: string): Promise<Habit[]> {
    const { data, error } = await supabase
      .from('habits').select('*')
      .eq('user_id', userId).eq('is_active', true).eq('is_archived', false)
      .order('created_at', { ascending: false })
    if (error) throw error
    return (data ?? []).map(mapHabit)
  },

  async getById(habitId: string): Promise<Habit> {
    const { data, error } = await supabase
      .from('habits').select('*').eq('id', habitId).single()
    if (error) throw error
    return mapHabit(data)
  },

  async create(userId: string, input: CreateHabitInput): Promise<Habit> {
    const { data, error } = await supabase
      .from('habits')
      .insert({
        user_id: userId,
        name: input.name,
        description: input.description,
        frequency_type: input.frequencyType,
        frequency_value: input.frequencyValue,
        scheduled_days: input.scheduledDays,
        difficulty_tier: input.difficultyTier,
        base_xp: input.baseXP,
        is_active: input.isActive,
        start_date: input.startDate,
        end_date: input.endDate,
        current_streak: 0,
        longest_streak: 0,
      })
      .select().single()
    if (error) throw error
    return mapHabit(data)
  },

  async updateStreak(habitId: string, currentStreak: number, longestStreak: number): Promise<void> {
    const { error } = await supabase
      .from('habits')
      .update({ current_streak: currentStreak, longest_streak: longestStreak })
      .eq('id', habitId)
    if (error) throw error
  },

  async archive(habitId: string): Promise<void> {
    const { error } = await supabase
      .from('habits').update({ is_archived: true, is_active: false }).eq('id', habitId)
    if (error) throw error
  },

  async logCompletion(
    habitId: string, userId: string,
    xpEarned: number, streakMultiplier: number, note?: string
  ): Promise<HabitLog> {
    const { data, error } = await supabase
      .from('habit_logs')
      .insert({
        habit_id: habitId, user_id: userId,
        completed_at: new Date().toISOString(),
        xp_earned: xpEarned, streak_multiplier: streakMultiplier, note,
      })
      .select().single()
    if (error) throw error
    return mapHabitLog(data)
  },

  async getLogsForHabit(habitId: string, limit = 30): Promise<HabitLog[]> {
    const { data, error } = await supabase
      .from('habit_logs').select('*').eq('habit_id', habitId)
      .order('completed_at', { ascending: false }).limit(limit)
    if (error) throw error
    return (data ?? []).map(mapHabitLog)
  },

  async wasCompletedToday(habitId: string, userId: string): Promise<boolean> {
    const today = new Date().toISOString().split('T')[0]
    const { count, error } = await supabase
      .from('habit_logs').select('*', { count: 'exact', head: true })
      .eq('habit_id', habitId).eq('user_id', userId)
      .gte('completed_at', `${today}T00:00:00`)
    if (error) throw error
    return (count ?? 0) > 0
  },
}
