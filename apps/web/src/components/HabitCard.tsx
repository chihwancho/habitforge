import { useState } from 'react'
import { Habit } from '@habitforge/shared'

interface HabitCardProps {
  habit: Habit
  isCompleted: boolean
  onComplete: (note?: string) => Promise<any>
  onArchive: () => Promise<void>
}

export default function HabitCard({ habit, isCompleted, onComplete, onArchive }: HabitCardProps) {
  const [completing, setCompleting] = useState(false)
  const [justCompleted, setJustCompleted] = useState(false)

  const done = isCompleted || justCompleted

  const handleComplete = async () => {
    setCompleting(true)
    try {
      await onComplete()
      setJustCompleted(true)
      setTimeout(() => setJustCompleted(false), 2000)
    } catch (e: any) {
      alert(e.message)
    } finally {
      setCompleting(false)
    }
  }

  const difficultyLabel = ['', 'Easy', 'Medium', 'Hard'][habit.difficultyTier]

  return (
    <div className={`habit-card ${done ? 'just-completed' : ''}`}>
      <div className="habit-card-header">
        <div>
          <h3>{habit.name}</h3>
          {habit.description && <p className="habit-desc">{habit.description}</p>}
        </div>
        <button className="btn-ghost btn-sm" onClick={onArchive} title="Archive">✕</button>
      </div>

      <div className="habit-meta">
        <span className={`difficulty-badge tier-${habit.difficultyTier}`}>{difficultyLabel}</span>
        <span className="frequency-badge">{habit.frequencyType}</span>
        <span className="xp-badge">+{habit.baseXP} XP base</span>
      </div>

      <div className="habit-streak">
        <span className="streak-fire">🔥</span>
        <span className="streak-count">{habit.currentStreak} day streak</span>
        {habit.longestStreak > 0 && (
          <span className="streak-best">Best: {habit.longestStreak}</span>
        )}
      </div>

      <button
        className={`btn-complete ${done ? 'completed' : ''}`}
        onClick={handleComplete}
        disabled={completing || done}
      >
        {done ? '✓ Done!' : completing ? 'Saving...' : 'Complete'}
      </button>
    </div>
  )
}