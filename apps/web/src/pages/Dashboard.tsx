import { useState, useCallback } from 'react'
import { useHabits, useXP } from '@habitforge/shared'
import { useAuthContext } from '../contexts/AuthContext'
import HabitCard from '../components/HabitCard'
import CreateHabitModal from '../components/CreateHabitModal'
import { XPBar, NavBar } from '../components/NavBar'
import { ToastContainer, useToasts } from '../components/Toast'

export default function Dashboard() {
  const { profile, refreshProfile } = useAuthContext()
  const { levelInfo, refresh: refreshXP } = useXP(profile?.id ?? '')
  const { toasts, addToast, dismissToast } = useToasts()

  const handleXPChange = useCallback(() => {
    refreshProfile()
    refreshXP()
  }, [refreshProfile, refreshXP])

  const { habits, completedIds, loading, createHabit, completeHabit, archiveHabit } = useHabits(profile?.id ?? '', handleXPChange)
  const [showCreate, setShowCreate] = useState(false)

  if (!profile) return <div className="loading-screen">Loading...</div>

  const handleComplete = async (habitId: string, note?: string) => {
    const result = await completeHabit(habitId, note)
    addToast(`+${result.xpEarned} XP · ${result.newStreak} day streak`, 'xp')
    if (result.badgesEarned.length > 0) {
      for (const badge of result.badgesEarned) {
        addToast(`Badge unlocked: ${badge}!`, 'badge')
      }
    }
    return result
  }

  return (
    <div className="page">
      <NavBar />
      <div className="page-content">
        <header className="dashboard-header">
          <div>
            <h1>Hey, {profile.username}</h1>
            <p className="subtitle">Keep the streak alive.</p>
          </div>
          <button className="btn-primary" onClick={() => setShowCreate(true)}>+ New Habit</button>
        </header>

        {levelInfo && <XPBar levelInfo={levelInfo} badgePoints={profile.badgePoints ?? 0} />}

        {loading ? (
          <div className="loading">Loading habits...</div>
        ) : habits.length === 0 ? (
          <div className="empty-state">
            <p>No habits yet. Create your first one to start earning XP!</p>
          </div>
        ) : (
          <div className="habit-grid">
            {habits.map(habit => (
              <HabitCard
                key={habit.id}
                habit={habit}
                isCompleted={completedIds.has(habit.id)}
                onComplete={(note) => handleComplete(habit.id, note)}
                onArchive={() => archiveHabit(habit.id)}
              />
            ))}
          </div>
        )}
      </div>

      {showCreate && (
        <CreateHabitModal
          onClose={() => setShowCreate(false)}
          onCreate={async (input) => { await createHabit(input); setShowCreate(false) }}
        />
      )}

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  )
}