import { useState } from 'react'
import { useRewards } from '@habitforge/shared'
import { useAuthContext } from '../contexts/AuthContext'
import { NavBar } from '../components/NavBar'
import { CreateRewardModal } from '../components/CreateRewardModal'

export default function Rewards() {
  const { profile } = useAuthContext()
  const { rewards, loading, createReward, redeemReward } = useRewards(profile?.id ?? '')
  const [showCreate, setShowCreate] = useState(false)
  const [redeeming, setRedeeming] = useState<string | null>(null)

  if (!profile) return <div className="loading-screen">Loading...</div>

  const handleRedeem = async (rewardId: string) => {
    setRedeeming(rewardId)
    try {
      await redeemReward(rewardId)
      alert('Reward redeemed!')
    } catch (e: any) {
      alert(e.message)
    } finally {
      setRedeeming(null)
    }
  }

  return (
    <div className="page">
      <NavBar />
      <div className="page-content">
        <header className="page-header">
          <div>
            <h1>Rewards</h1>
            <p className="subtitle">You have {profile?.badgePoints ?? 0} badge points to spend</p>
          </div>
          <button className="btn-primary" onClick={() => setShowCreate(true)}>+ New Reward</button>
        </header>

        {loading ? (
          <div className="loading">Loading rewards...</div>
        ) : rewards.length === 0 ? (
          <div className="empty-state">
            <p>No rewards yet. Create one to give yourself something to work toward!</p>
          </div>
        ) : (
          <div className="reward-grid">
            {rewards.map(reward => {
              const canAfford = (profile?.badgePoints ?? 0) >= reward.badgePointCost
              return (
                <div key={reward.id} className={`reward-card ${!canAfford ? 'unaffordable' : ''}`}>
                  <div className="reward-info">
                    <h3>{reward.name}</h3>
                    {reward.description && <p>{reward.description}</p>}
                    <span className="reward-cost">{reward.badgePointCost} pts</span>
                  </div>
                  <button
                    className="btn-secondary"
                    disabled={!canAfford || redeeming === reward.id}
                    onClick={() => handleRedeem(reward.id)}
                  >
                    {redeeming === reward.id ? 'Redeeming...' : 'Redeem'}
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {showCreate && (
        <CreateRewardModal
          onClose={() => setShowCreate(false)}
          onCreate={async (input) => { await createReward(input); setShowCreate(false) }}
        />
      )}
    </div>
  )
}
