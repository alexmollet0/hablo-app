import { useMemo, useState } from 'react'
import { VOCAB, wordFor } from '../content/vocab'

const QUESTIONS_PER_ROUND = 10

export default function QuizGame({ variant, level, onExit }) {
  const pool = useMemo(() => VOCAB.filter((c) => c.level <= level), [level])
  const [rounds] = useState(() => buildRounds(pool, variant))
  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [selected, setSelected] = useState(null)

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
          <h1>Score : {score} / {rounds.length}</h1>
          <button onClick={onExit}>Retour</button>
        </div>
      </div>
    )
  }

  const round = rounds[index]

  function choose(option) {
    if (selected) return
    setSelected(option)
    if (option === round.correct) setScore((s) => s + 1)
    setTimeout(() => {
      setSelected(null)
      setIndex((i) => i + 1)
    }, 700)
  }

  return (
    <div className="screen-center">
      <div className="card center">
        <p className="muted">Question {index + 1} / {rounds.length} · Score {score}</p>
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

function buildRounds(pool, variant) {
  const shuffled = shuffle(pool).slice(0, Math.min(QUESTIONS_PER_ROUND, pool.length))
  return shuffled.map((card) => {
    const correct = wordFor(card, variant)
    const distractors = shuffle(pool.filter((c) => c.id !== card.id))
      .slice(0, 3)
      .map((c) => wordFor(c, variant))
    return { fr: card.fr, correct, options: shuffle([correct, ...distractors]) }
  })
}

function shuffle(arr) {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}
