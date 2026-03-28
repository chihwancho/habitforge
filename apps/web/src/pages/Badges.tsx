import { useBadges } from '@habitforge/shared'
import { useAuthContext } from '../contexts/AuthContext'
import { NavBar } from '../components/NavBar'

export default function Badges() {
  const { profile } = useAuthContext()
  const { badges, allBadges, earnedIds, loading } = useBadges(profile!.id)

  return (
    <div className="page">
      <NavBar />
      <div className="page-content">
        <header className="page-header">
          <h1>Badges</h1>
          <p className="subtitle">{badges.length} earned · {profile?.badgePoints ?? 0} badge points</p>
        </header>

        {loading ? (
          <div className="loading">Loading badges...</div>
        ) : (
          <div className="badge-grid">
            {allBadges.map(badge => {
              const earned = earnedIds.has(badge.id)
              return (
                <div key={badge.id} className={`badge-card ${earned ? 'earned' : 'locked'}`}>
                  <div className="badge-icon">
                    {badge.iconUrl
                      ? <img src={badge.iconUrl} alt={badge.name} />
                      : <span className="badge-placeholder">{badge.name[0]}</span>
                    }
                  </div>
                  <div className="badge-info">
                    <h3>{badge.name}</h3>
                    <p>{badge.description}</p>
                    <span className="badge-points">{badge.badgePointValue} pts</span>
                  </div>
                  {!earned && <div className="locked-overlay">Locked</div>}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
