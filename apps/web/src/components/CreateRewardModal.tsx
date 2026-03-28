import { useState } from 'react'
import { CreateRewardInput } from '@habitforge/shared'

interface CreateRewardModalProps {
  onClose: () => void
  onCreate: (input: CreateRewardInput) => Promise<void>
}

export function CreateRewardModal({ onClose, onCreate }: CreateRewardModalProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [badgePointCost, setBadgePointCost] = useState(10)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onCreate({ name, description, badgePointCost, rewardType: 'custom', isActive: true })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2>New Reward</h2>
        <form onSubmit={handleSubmit} className="modal-form">
          <label>
            Reward name
            <input type="text" value={name} onChange={e => setName(e.target.value)}
              placeholder="e.g. Movie night" required />
          </label>

          <label>
            Description (optional)
            <input type="text" value={description} onChange={e => setDescription(e.target.value)}
              placeholder="What is this reward?" />
          </label>

          <label>
            Badge point cost
            <input type="number" min={1} value={badgePointCost}
              onChange={e => setBadgePointCost(Number(e.target.value))} required />
          </label>

          <div className="modal-actions">
            <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Creating...' : 'Create Reward'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateRewardModal
