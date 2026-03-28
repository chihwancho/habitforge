import { DifficultyTier, LevelInfo, XPCalculation } from '../types'

const DIFFICULTY_MULTIPLIERS: Record<DifficultyTier, number> = { 1: 1.0, 2: 1.5, 3: 2.0 }

export const BASE_XP: Record<DifficultyTier, number> = { 1: 10, 2: 25, 3: 50 }

export const getStreakMultiplier = (streak: number): number => {
  if (streak >= 30) return 3.0
  if (streak >= 14) return 2.5
  if (streak >= 7)  return 2.0
  if (streak >= 3)  return 1.5
  return 1.0
}

export const calculateXP = (
  baseXP: number,
  difficulty: DifficultyTier,
  streak: number
): XPCalculation => {
  const difficultyMultiplier = DIFFICULTY_MULTIPLIERS[difficulty]
  const streakMultiplier = getStreakMultiplier(streak)
  const totalXP = Math.round(baseXP * difficultyMultiplier * streakMultiplier)
  return { baseXP, streakMultiplier, difficultyMultiplier, totalXP }
}

export const XP_FOR_LEVEL = (level: number): number => level * 100

export const getLevelFromXP = (totalXP: number): number => {
  let level = 1
  let xpUsed = 0
  while (xpUsed + XP_FOR_LEVEL(level) <= totalXP) {
    xpUsed += XP_FOR_LEVEL(level)
    level++
  }
  return level
}

export const getLevelInfo = (totalXP: number): LevelInfo => {
  const level = getLevelFromXP(totalXP)
  let xpUsed = 0
  for (let l = 1; l < level; l++) xpUsed += XP_FOR_LEVEL(l)
  const currentXP = totalXP - xpUsed
  const xpForNextLevel = XP_FOR_LEVEL(level)
  const progressPercent = Math.round((currentXP / xpForNextLevel) * 100)
  return { level, currentXP, xpForNextLevel, progressPercent }
}
