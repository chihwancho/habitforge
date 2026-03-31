import { supabase } from '../providers/supabaseProvider'
import { userRepository, rewardRepository } from '../repositories/userRepository'
import type { CreateRewardInput, Reward, RewardRedemption, User } from '../types'

export const authService = {
  async signUp(email: string, password: string, username: string): Promise<User> {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username }
      }
    })
    if (error) throw error
    if (!data.user) throw new Error('Sign up failed')
  
    // Trigger handles profile creation — just fetch it
    const profile = await userRepository.getById(data.user.id)
    return profile
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  },

  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  async getProfile(userId: string): Promise<User> {
    return userRepository.getById(userId)
  },

  onAuthStateChange(callback: (user: any) => void) {
    return supabase.auth.onAuthStateChange((_event, session) => {
      callback(session?.user ?? null)
    })
  },
}

export const rewardService = {
  async getRewards(userId: string): Promise<Reward[]> {
    return rewardRepository.getAll(userId)
  },

  async createReward(userId: string, input: CreateRewardInput): Promise<Reward> {
    return rewardRepository.create(userId, input)
  },

  async redeemReward(userId: string, rewardId: string): Promise<RewardRedemption> {
    const user = await userRepository.getById(userId)
    const rewards = await rewardRepository.getAll(userId)
    const reward = rewards.find(r => r.id === rewardId)
    if (!reward) throw new Error('Reward not found')
    if (user.badgePoints < reward.badgePointCost) {
      throw new Error(`Not enough badge points. Need ${reward.badgePointCost}, have ${user.badgePoints}`)
    }
    await userRepository.deductBadgePoints(userId, reward.badgePointCost)
    return rewardRepository.redeem(userId, rewardId, reward.badgePointCost)
  },
}
