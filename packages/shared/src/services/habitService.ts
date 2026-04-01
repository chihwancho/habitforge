import { habitRepository } from '../repositories/habitRepository'
import { userRepository } from '../repositories/userRepository'
import type { CreateHabitInput, Habit, HabitLog } from '../types'
import { BASE_XP, calculateXP } from '../utils/xp'
import { badgeService } from './badgeService'
 
export const habitService = {
  async getHabits(userId: string): Promise<Habit[]> {
    return habitRepository.getAll(userId)
  },
 
  async createHabit(userId: string, input: CreateHabitInput): Promise<Habit> {
    const baseXP = input.baseXP ?? BASE_XP[input.difficultyTier as 1 | 2 | 3]
    return habitRepository.create(userId, { ...input, baseXP })
  },
 
  async completeHabit(habitId: string, userId: string, note?: string): Promise<{
    log: HabitLog
    xpEarned: number
    newStreak: number
    badgesEarned: string[]
  }> {
    const habit = await habitRepository.getById(habitId)
    const alreadyDone = await habitRepository.wasCompletedInPeriod(habitId, userId, habit.frequencyType)
    if (alreadyDone) throw new Error('Habit already completed for this period')
 
    const newStreak = habit.currentStreak + 1
    const { totalXP, streakMultiplier } = calculateXP(
      habit.baseXP,
      habit.difficultyTier as 1 | 2 | 3,
      newStreak
    )
 
    const log = await habitRepository.logCompletion(habitId, userId, totalXP, streakMultiplier, note)
    const longestStreak = Math.max(newStreak, habit.longestStreak)
    await habitRepository.updateStreak(habitId, newStreak, longestStreak)
    await userRepository.addXP(userId, totalXP)
 
    const badgesEarned = await badgeService.checkAndAward(userId, {
      event: 'habit_completed', streak: newStreak, habitId,
    })
 
    return { log, xpEarned: totalXP, newStreak, badgesEarned }
  },
 
  async archiveHabit(habitId: string): Promise<void> {
    return habitRepository.archive(habitId)
  },
 
  async getHabitLogs(habitId: string, limit?: number): Promise<HabitLog[]> {
    return habitRepository.getLogsForHabit(habitId, limit)
  },
 
  async getCompletionStatuses(userId: string, habits: Habit[]): Promise<Set<string>> {
    const habitIds = habits.map(h => h.id)
    return habitRepository.getCompletionStatuses(
      habitIds,
      userId,
      habits.map(h => ({ id: h.id, frequencyType: h.frequencyType }))
    )
  },
}