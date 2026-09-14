import { useMemo, useRef, useState } from 'react'
import { LANGUAGES } from '../content/language'
import { buildQuizRounds } from '../content/quizRounds'

const QUESTIONS_PER_ROUND = 10
const SPIN_SYMBOLS = ['🍒', '🔔', '💎', '👑', '⭐', '🍋']
const SPIN_DURATION_MS = 900
const SPIN_TICK_MS = 80

// Paliers de récompense — tirage pondéré AVANT l'animation (simplification volontaire pour la
// V1 : les 3 rouleaux affichent tous le même symbole final, pas une vraie logique de
// correspondance indépendante par rouleau).
const TIERS = [
  { key: 'commun', label: 'Commun', emoji: '🍒', weight: 60, coins: 5 },
  { key: 'rare', label: 'Rare', emoji: '🔔', weight: 25, coins: 15 },
  { key: 'epique', label: 'Épique', emoji: '💎', weight: 12, coins: 40 },
  { key: 'legendaire', label: 'Légendaire', emoji: '👑', weight: 3, coins: 100 },
]

function drawTier() {
  const totalWeight = TIERS.reduce((sum, t) => sum + t.weight, 0)
  let roll = Math.random() * totalWeight
  for (const tier of TIERS) {
    if (roll < tier.weight) return tier
    roll -= tier.weight
  }
  return TIERS[0]
}

export default function SlotMachineGame({ language, variant, level, onCoinsEarned, onExit }) {
  const pool = useMemo(
    () => LANGUAGES[language].vocab.filter((c) => c.level <= level),
    [language, level]
  )
  const [rounds] = useState(() => buildQuizRounds(pool, language, variant, QUESTIONS_PER_ROUND))
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState(null)
  const [phase, setPhase] = useState('idle') // 'idle' | 'spinning' | 'result'
  const [reelSymbol, setReelSymbol] = useState('🍒')
  const [resultTier, setResultTier] = useState(null)
  const [sessionCoins, setSessionCoins] = useState(0)
  const intervalRef = useRef(null)

  if (pool.length < 4) {
    return (
      <div className="screen-center">
        <div className="card center">
          <p>Pas encore assez de mots débloqués pour ce jeu.</p>
          <button onClick={onExit}>Retour</button>
        </div>
      </div>
    )
  }

  if (index >= rounds.length) {
    return (
      <div className="screen-center">
        <div className="card center">
          <h1>🪙 +{sessionCoins} pièces gagnées !</h1>
          <button onClick={onExit}>Retour</button>
        </div>
      </div>
    )
  }

  const round = rounds[index]

  function nextRound() {
    setIndex((i) => i + 1)
    setSelected(null)
    setPhase('idle')
    setResultTier(null)
  }

  function choose(option) {
    if (selected) return
    setSelected(option)

    if (option !== round.correct) {
      setTimeout(nextRound, 900)
      return
    }

    const tier = drawTier()
    setPhase('spinning')
    let ticks = 0
    const totalTicks = Math.round(SPIN_DURATION_MS / SPIN_TICK_MS)
    intervalRef.current = setInterval(() => {
      ticks += 1
      setReelSymbol(SPIN_SYMBOLS[Math.floor(Math.random() * SPIN_SYMBOLS.length)])
      if (ticks >= totalTicks) {
        clearInterval(intervalRef.current)
        setReelSymbol(tier.emoji)
        setResultTier(tier)
        setPhase('result')
        setSessionCoins((c) => c + tier.coins)
        onCoinsEarned(tier.coins)
      }
    }, SPIN_TICK_MS)
  }

  return (
    <div className="screen-center">
      <div className="card center">
        <p className="muted">Question {index + 1} / {rounds.length} · 🪙 +{sessionCoins} cette partie</p>
        <h2>Comment dit-on « {round.fr} » ?</h2>

        {phase === 'idle' && !selected && (
          <div className="options">
            {round.options.map((opt) => (
              <button key={opt} className="option" onClick={() => choose(opt)}>{opt}</button>
            ))}
          </div>
        )}

        {selected && selected !== round.correct && (
          <div className="options">
            {round.options.map((opt) => {
              const isCorrect = opt === round.correct
              const isWrong = opt === selected
              return (
                <button key={opt} className={`option ${isCorrect ? 'success' : ''} ${isWrong ? 'danger' : ''}`} disabled>
                  {opt}
                </button>
              )
            })}
          </div>
        )}

        {(phase === 'spinning' || phase === 'result') && (
          <div className="slot-machine">
            <div className="reels">
              <div className={`reel ${phase === 'spinning' ? 'spinning' : ''}`}>{reelSymbol}</div>
              <div className={`reel ${phase === 'spinning' ? 'spinning' : ''}`}>{reelSymbol}</div>
              <div className={`reel ${phase === 'spinning' ? 'spinning' : ''}`}>{reelSymbol}</div>
            </div>
            {phase === 'result' && (
              <>
                <p className="tier-label">{resultTier.label} — +{resultTier.coins} pièces</p>
                <button onClick={nextRound}>Continuer</button>
              </>
            )}
          </div>
        )}

        <button className="link" onClick={onExit}>Quitter</button>
      </div>
    </div>
  )
}
