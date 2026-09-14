import { useMemo, useRef, useState } from 'react'
import { LANGUAGES } from '../content/language'
import { buildQuizRounds } from '../content/quizRounds'
import { drawTier } from '../content/rewardTiers'

const QUESTIONS_PER_ROUND = 10
const SPIN_SYMBOLS = ['🍒', '🔔', '💎', '👑', '⭐', '🍋']
const SPIN_DURATION_MS = 900
const SPIN_TICK_MS = 80
// Tirage pondéré AVANT l'animation (simplification volontaire pour la V1 : les 3 rouleaux
// affichent tous le même symbole final, pas une vraie logique de correspondance indépendante
// par rouleau) — voir content/rewardTiers.js pour les paliers, partagés avec la roue/les coffres.

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
  const [capInfo, setCapInfo] = useState(null) // {gained, capped}, résultat de applyDailyCoins
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
    setCapInfo(null)
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
        onCoinsEarned(tier.coins).then((res) => {
          setSessionCoins((c) => c + res.gained)
          setCapInfo(res)
        })
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
                <p className="tier-label">
                  {resultTier.label}
                  {!capInfo && ` — +${resultTier.coins} pièces`}
                  {capInfo && !capInfo.capped && ` — +${resultTier.coins} pièces`}
                  {capInfo && capInfo.capped && capInfo.gained > 0 && ` — +${capInfo.gained} pièces (plafond quotidien presque atteint)`}
                </p>
                {capInfo?.capped && capInfo.gained === 0 && (
                  <p className="muted">Plafond de pièces atteint pour aujourd’hui — reviens demain !</p>
                )}
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
