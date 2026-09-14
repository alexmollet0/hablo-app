import { useMemo, useState } from 'react'
import { LANGUAGES } from '../content/language'
import { buildQuizRounds } from '../content/quizRounds'

const QUESTIONS_PER_ROUND = 10

export default function QuizGame({ language, variant, level, onExit }) {
  const pool = useMemo(
    () => LANGUAGES[language].vocab.filter((c) => c.level <= level),
    [language, level]
  )
  const [rounds] = useState(() => buildQuizRounds(pool, language, variant, QUESTIONS_PER_ROUND))
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
