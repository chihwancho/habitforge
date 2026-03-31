import { useState } from 'react'
import { useHabits, useXP } from '@habitforge/shared'
import { useAuthContext } from '../contexts/AuthContext'
import HabitCard from '../components/HabitCard'
import CreateHabitModal from '../components/CreateHabitModal'
import { XPBar, NavBar } from '../components/NavBar'

export default function Dashboard() {
  const { profile } = useAuthContext()
  const { habits, loading, createHabit, completeHabit, archiveHabit } = useHabits(profile?.id ?? '')
  const { levelInfo } = useXP(profile?.id ?? '')
  const [showCreate, setShowCreate] = useState(false)

  if (!profile) return <div className="loading-screen">Loading...</div>

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
                onComplete={(note) => completeHabit(habit.id, note)}
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
    </div>
  )
}
