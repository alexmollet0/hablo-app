import { useEffect, useMemo, useRef, useState } from 'react'
import { LANGUAGES } from '../content/language'
import { buildQuizRounds } from '../content/quizRounds'

const QUESTIONS_PER_CHALLENGE = 15
const MIN_REWARD = 20
const MAX_REWARD = 150

// Récompense basée sur la performance réelle (pas un montant fixe) — c'est le point de ce jeu :
// une tentative ratée rapporte quand même un minimum pour avoir essayé, un sans-faute rapporte
// le maximum. Hors du plafond quotidien de pièces (déjà borné à 1 tentative/jour, voir App.jsx).
function rewardFor(score, total) {
  return Math.min(MAX_REWARD, Math.max(MIN_REWARD, Math.round((MAX_REWARD * score) / total)))
}

export default function DailyChallenge({ language, variant, level, alreadyPlayed, onStart, onXpEarned, onFinish, onExit }) {
  const pool = useMemo(
    () => LANGUAGES[language].vocab.filter((c) => c.level <= level),
    [language, level]
  )
  const enough = pool.length >= 4
  const [rounds] = useState(() => (enough ? buildQuizRounds(pool, language, variant, QUESTIONS_PER_CHALLENGE) : []))
  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [selected, setSelected] = useState(null)
  const finishedRef = useRef(false)
  // Capturé une seule fois au montage : `onStart` ci-dessous écrit `challenge_last_play` dans le
  // profil parent, ce qui ferait revenir `alreadyPlayed` à true en plein milieu de la partie si on
  // lisait la prop en direct (on afficherait "déjà joué" juste après avoir cliqué "démarrer").
  const [wasAlreadyPlayed] = useState(alreadyPlayed)

  // Consomme la tentative du jour dès le lancement, pas à la fin — sinon quitter en cours de
  // partie et recommencer permettrait de refarmer un bon score.
  useEffect(() => {
    if (!wasAlreadyPlayed && enough) onStart()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (index >= rounds.length && rounds.length > 0 && !finishedRef.current) {
      finishedRef.current = true
      onFinish(rewardFor(score, rounds.length))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index >= rounds.length])

  if (!enough) {
    return (
      <div className="screen-center">
        <div className="card center">
          <p>Pas encore assez de mots débloqués pour ce défi.</p>
          <button onClick={onExit}>Retour</button>
        </div>
      </div>
    )
  }

  if (wasAlreadyPlayed) {
    return (
      <div className="screen-center">
        <div className="card center">
          <h1>🏆 Défi du jour</h1>
          <p className="muted">Déjà joué aujourd’hui. Reviens demain pour un nouveau défi !</p>
          <button className="link" onClick={onExit}>Retour</button>
        </div>
      </div>
    )
  }

  if (index >= rounds.length) {
    const coinsWon = rewardFor(score, rounds.length)
    return (
      <div className="screen-center">
        <div className="card center">
          <h1>Score : {score} / {rounds.length}</h1>
          <p className="tier-label">🪙 +{coinsWon} pièces</p>
          <button onClick={onExit}>Retour</button>
        </div>
      </div>
    )
  }

  const round = rounds[index]

  function choose(option) {
    if (selected) return
    setSelected(option)
    if (option === round.correct) {
      setScore((s) => s + 1)
      onXpEarned(8)
    }
    setTimeout(() => {
      setSelected(null)
      setIndex((i) => i + 1)
    }, 700)
  }

  return (
    <div className="screen-center">
      <div className="card center">
        <p className="muted">Défi du jour · Question {index + 1} / {rounds.length} · Score {score}</p>
        <h2>Comment dit-on « {round.fr} » ?</h2>
        <div className="options">
          {round.options.map((opt) => {
            const isCorrect = selected && opt === round.correct
            const isWrong = selected === opt && opt !== round.correct
            return (
              <button
                key={opt}
                className={`option ${isCorrect ? 'success' : ''} ${isWrong ? 'danger' : ''}`}
                onClick={() => choose(opt)}
              >
                {opt}
              </button>
            )
          })}
        </div>
        <button className="link" onClick={onExit}>Quitter</button>
      </div>
    </div>
  )
}
