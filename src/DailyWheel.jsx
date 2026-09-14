import { useState } from 'react'

const SPIN_DURATION_MS = 1200

// Un tour par jour — table de récompenses propre à la roue (distincte de rewardTiers.js, qui
// sert la machine à sous/les coffres) : surtout des pièces, rarement un coffre gratuit, très
// rarement un gros lot.
const OUTCOMES = [
  { key: 'small', label: 'Petit lot', emoji: '🪙', weight: 50, coins: 30 },
  { key: 'medium', label: 'Lot moyen', emoji: '🪙', weight: 25, coins: 75 },
  { key: 'chest', label: 'Coffre gratuit', emoji: '🎁', weight: 15, coins: 0, chest: true },
  { key: 'big', label: 'Gros lot', emoji: '💰', weight: 8, coins: 150 },
  { key: 'jackpot', label: 'JACKPOT', emoji: '🎉', weight: 2, coins: 500 },
]

function drawOutcome() {
  const totalWeight = OUTCOMES.reduce((sum, o) => sum + o.weight, 0)
  let roll = Math.random() * totalWeight
  for (const o of OUTCOMES) {
    if (roll < o.weight) return o
    roll -= o.weight
  }
  return OUTCOMES[0]
}

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

export default function DailyWheel({ lastSpin, onSpinResult, onExit }) {
  const alreadySpun = lastSpin === todayISO()
  const [phase, setPhase] = useState('idle') // 'idle' | 'spinning' | 'result'
  const [outcome, setOutcome] = useState(null)

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
          <p className="muted">Reviens demain pour un nouveau tour !</p>
        ) : phase === 'idle' ? (
          <button onClick={spin}>Tourner la roue</button>
        ) : null}

        <button className="link" onClick={onExit}>Retour</button>
      </div>
    </div>
  )
}
