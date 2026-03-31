import { useCallback, useEffect, useState } from 'react'
import { authService, rewardService } from '../services/authRewardService'
import { badgeService } from '../services/badgeService'
import { habitService } from '../services/habitService'
import { userRepository } from '../repositories/userRepository'
import { badgeRepository } from '../repositories/badgeRepository'
import type { Badge, CreateHabitInput, CreateRewardInput, Habit, Reward, User, UserBadge } from '../types'
import { getLevelInfo } from '../utils/xp'
import type { LevelInfo } from '../types'

export function useAuth() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const { data: { subscription } } = authService.onAuthStateChange(async (authUser) => {
      setUser(authUser)
      if (authUser) {
        try {
          const p = await authService.getProfile(authUser.id)
          setProfile(p)
        } catch {
          setProfile(null)
        }
      } else {
        setProfile(null)
      }
      setLoading(false)
    })
    return () => subscription.unsubscribe()
  }, [])

  const signIn = useCallback((email: string, password: string) =>
    authService.signIn(email, password), [])
  const signUp = useCallback((email: string, password: string, username: string) =>
    authService.signUp(email, password, username), [])
  const signOut = useCallback(() => authService.signOut(), [])

  return { user, profile, loading, signIn, signUp, signOut }
}

export function useHabits(userId: string) {
  const [habits, setHabits] = useState<Habit[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchHabits = useCallback(async () => {
    if (!userId) return
    try {
      setLoading(true)
      setHabits(await habitService.getHabits(userId))
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => { fetchHabits() }, [fetchHabits])

  const createHabit = useCallback(async (input: CreateHabitInput) => {
    const h = await habitService.createHabit(userId, input)
    setHabits(prev => [h, ...prev])
    return h
  }, [userId])

  const completeHabit = useCallback(async (habitId: string, note?: string) => {
    const result = await habitService.completeHabit(habitId, userId, note)
    setHabits(prev => prev.map(h =>
      h.id === habitId ? { ...h, currentStreak: result.newStreak } : h
    ))
    return result
  }, [userId])

  const archiveHabit = useCallback(async (habitId: string) => {
    await habitService.archiveHabit(habitId)
    setHabits(prev => prev.filter(h => h.id !== habitId))
  }, [])

  return { habits, loading, error, createHabit, completeHabit, archiveHabit, refresh: fetchHabits }
}

export function useXP(userId: string) {
  const [levelInfo, setLevelInfo] = useState<LevelInfo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) return
    userRepository.getById(userId)
      .then(u => setLevelInfo(getLevelInfo(u.totalXP)))
      .finally(() => setLoading(false))
  }, [userId])

  return { levelInfo, loading }
}

export function useBadges(userId: string) {
  const [badges, setBadges] = useState<UserBadge[]>([])
  const [allBadges, setAllBadges] = useState<Badge[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) return
    Promise.all([badgeService.getUserBadges(userId), badgeRepository.getAllBadges()])
      .then(([earned, all]) => { setBadges(earned); setAllBadges(all) })
      .finally(() => setLoading(false))
  }, [userId])

  const earnedIds = new Set(badges.map(b => b.badgeId))
  return { badges, allBadges, earnedIds, loading }
}

export function useRewards(userId: string) {
  const [rewards, setRewards] = useState<Reward[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) return
    rewardService.getRewards(userId)
      .then(setRewards)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [userId])

  const createReward = useCallback(async (input: CreateRewardInput) => {
    const r = await rewardService.createReward(userId, input)
    setRewards(prev => [...prev, r])
    return r
  }, [userId])

  const redeemReward = useCallback((rewardId: string) =>
    rewardService.redeemReward(userId, rewardId), [userId])

  return { rewards, loading, error, createReward, redeemReward }
}
