import { MAX_LEVEL, xpToNextLevel } from './content/level'

export default function LevelProgress({ level, xp }) {
  const maxed = level >= MAX_LEVEL
  const needed = maxed ? 0 : xpToNextLevel(level)
  const pct = maxed ? 100 : Math.min(100, Math.round((xp / needed) * 100))

  return (
    <div className="level-progress">
      <div className="level-ladder">
        {Array.from({ length: MAX_LEVEL }, (_, i) => i + 1).map((n) => (
          <span
            key={n}
            className={`level-node ${n < level ? 'done' : n === level ? 'current' : ''}`}
          >
            {n}
          </span>
        ))}
      </div>
      {maxed ? (
        <p className="level-xp-label">Niveau maximum atteint 🏆</p>
      ) : (
        <>
          <div className="level-xp-bar"><div className="level-xp-fill" style={{ width: `${pct}%` }} /></div>
          <p className="level-xp-label">{xp} / {needed} XP jusqu'au niveau {level + 1}</p>
        </>
      )}
    </div>
  )
}
