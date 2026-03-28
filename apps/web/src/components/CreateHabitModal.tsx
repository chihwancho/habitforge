import { useState } from 'react'
import { CreateHabitInput, DifficultyTier, FrequencyType, BASE_XP } from '@habitforge/shared'

interface CreateHabitModalProps {
  onClose: () => void
  onCreate: (input: CreateHabitInput) => Promise<void>
}

export default function CreateHabitModal({ onClose, onCreate }: CreateHabitModalProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [frequencyType, setFrequencyType] = useState<FrequencyType>('daily')
  const [difficultyTier, setDifficultyTier] = useState<DifficultyTier>(1)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onCreate({
        name,
        description,
        frequencyType,
        frequencyValue: 1,
        scheduledDays: [],
        difficultyTier,
        baseXP: BASE_XP[difficultyTier],
        isActive: true,
        startDate: new Date().toISOString(),
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2>New Habit</h2>
        <form onSubmit={handleSubmit} className="modal-form">
          <label>
            Name
            <input type="text" value={name} onChange={e => setName(e.target.value)}
              placeholder="e.g. Morning run" required />
          </label>

          <label>
            Description (optional)
            <input type="text" value={description} onChange={e => setDescription(e.target.value)}
              placeholder="A short note about this habit" />
          </label>

          <label>
            Frequency
            <select value={frequencyType} onChange={e => setFrequencyType(e.target.value as FrequencyType)}>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="custom">Custom</option>
              <option value="one-time">One-time goal</option>
            </select>
          </label>

          <label>
            Difficulty
            <div className="difficulty-selector">
              {([1, 2, 3] as DifficultyTier[]).map(tier => (
                <button
                  key={tier}
                  type="button"
                  className={`difficulty-option tier-${tier} ${difficultyTier === tier ? 'selected' : ''}`}
                  onClick={() => setDifficultyTier(tier)}
                >
                  {['Easy', 'Medium', 'Hard'][tier - 1]}
                  <span className="xp-hint">+{BASE_XP[tier]} XP</span>
                </button>
              ))}
            </div>
          </label>

          <div className="modal-actions">
            <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Creating...' : 'Create Habit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
