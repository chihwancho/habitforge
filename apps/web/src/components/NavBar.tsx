import { Link, useLocation } from 'react-router-dom'
import { LevelInfo } from '@habitforge/shared'
import { useAuthContext } from '../contexts/AuthContext'

export function XPBar({ levelInfo, badgePoints }: { levelInfo: LevelInfo; badgePoints: number }) {
  return (
    <div className="xp-bar-container">
      <div className="xp-bar-header">
        <span className="xp-level">Level {levelInfo.level}</span>
        <span className="xp-points">{levelInfo.currentXP} / {levelInfo.xpForNextLevel} XP</span>
        <span className="badge-points-display">{badgePoints} badge pts</span>
      </div>
      <div className="xp-bar-track">
        <div className="xp-bar-fill" style={{ width: `${levelInfo.progressPercent}%` }} />
      </div>
    </div>
  )
}

export function NavBar() {
  const { signOut, profile } = useAuthContext()
  const location = useLocation()

  const links = [
    { to: '/', label: 'Habits' },
    { to: '/badges', label: 'Badges' },
    { to: '/rewards', label: 'Rewards' },
  ]

  return (
    <nav className="navbar">
      <span className="navbar-logo">HabitForge</span>
      <div className="navbar-links">
        {links.map(link => (
          <Link key={link.to} to={link.to}
            className={location.pathname === link.to ? 'active' : ''}>
            {link.label}
          </Link>
        ))}
      </div>
      <div className="navbar-right">
        <span className="navbar-user">{profile?.username}</span>
        <button className="btn-ghost btn-sm" onClick={signOut}>Sign out</button>
      </div>
    </nav>
  )
}

export default NavBar
