import { useEffect, useState } from 'react'

const SPIN_DURATION_MS = 1200

// Un tour par jour — table de récompenses propre à la roue (distincte de rewardTiers.js, qui
// sert la machine à sous/les coffres) : surtout des pièces, rarement un coffre gratuit, très
// rarement un gros lot. Affichée aux joueurs (voir OddsList) — plus question de laisser deviner.
const OUTCOMES = [
  { key: 'small', label: 'Petit lot', emoji: '🪙', weight: 50, coins: 30 },
  { key: 'medium', label: 'Lot moyen', emoji: '🪙', weight: 25, coins: 75 },
  { key: 'chest', label: 'Coffre gratuit', emoji: '🎁', weight: 15, coins: 0, chest: true },
  { key: 'big', label: 'Gros lot', emoji: '💰', weight: 8, coins: 150 },
  { key: 'jackpot', label: 'JACKPOT', emoji: '🎉', weight: 2, coins: 500 },
]
const TOTAL_WEIGHT = OUTCOMES.reduce((sum, o) => sum + o.weight, 0)

function drawOutcome() {
  let roll = Math.random() * TOTAL_WEIGHT
  for (const o of OUTCOMES) {
    if (roll < o.weight) return o
    roll -= o.weight
  }
  return OUTCOMES[0]
}

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

// Temps restant avant minuit local, format HH:MM:SS.
function timeUntilMidnight() {
  const now = new Date()
  const midnight = new Date(now)
  midnight.setHours(24, 0, 0, 0)
  const ms = midnight - now
  const h = String(Math.floor(ms / 3600000)).padStart(2, '0')
  const m = String(Math.floor((ms % 3600000) / 60000)).padStart(2, '0')
  const s = String(Math.floor((ms % 60000) / 1000)).padStart(2, '0')
  return `${h}:${m}:${s}`
}

function OddsList() {
  const sorted = [...OUTCOMES].sort((a, b) => b.weight - a.weight)
  return (
    <ul className="odds-list">
      {sorted.map((o) => (
        <li key={o.key}>
          <span>{o.emoji} {o.label} — {o.coins > 0 ? `+${o.coins} pièces` : '+1 coffre'}</span>
          <span className="odds-percent">{Math.round((o.weight / TOTAL_WEIGHT) * 100)}%</span>
        </li>
      ))}
    </ul>
  )
}

export default function DailyWheel({ lastSpin, onSpinResult, onExit }) {
  const [now, setNow] = useState(() => todayISO())
  const alreadySpun = lastSpin === now
  const [phase, setPhase] = useState('idle') // 'idle' | 'spinning' | 'result'
  const [outcome, setOutcome] = useState(null)

  // Recalcule chaque seconde — sert à la fois au minuteur affiché et à repasser automatiquement
  // sur "Tourner la roue" après minuit, sans recharger la page.
  useEffect(() => {
    const id = setInterval(() => setNow(todayISO()), 1000)
    return () => clearInterval(id)
  }, [])

  function spin() {
    if (alreadySpun || phase !== 'idle') return
    setPhase('spinning')
    setTimeout(() => {
      const result = drawOutcome()
      setOutcome(result)
      setPhase('result')
      onSpinResult(result.coins, !!result.chest)
    }, SPIN_DURATION_MS)
  }

  return (
    <div className="screen-center">
      <div className="card center">
        <h1>🎡 Roue quotidienne</h1>
        <p className="muted">Un tour gratuit par jour.</p>

        <div className={`wheel-disc ${phase === 'spinning' ? 'spinning' : ''}`}>
          <span className="wheel-emoji">{phase === 'result' ? outcome.emoji : '🎡'}</span>
        </div>

        {phase === 'result' && (
          <p className="tier-label">{outcome.label}{outcome.coins > 0 ? ` — +${outcome.coins} pièces` : ' — +1 coffre'}</p>
        )}

        {alreadySpun && phase === 'idle' ? (
          <p className="muted">Prochain tour dans {timeUntilMidnight()}</p>
        ) : phase === 'idle' ? (
          <button onClick={spin}>Tourner la roue</button>
        ) : null}

        <h2 className="odds-title">Lots possibles</h2>
        <OddsList />

        <button className="link" onClick={onExit}>Retour</button>
      </div>
    </div>
  )
}
