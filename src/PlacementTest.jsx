import { useState } from 'react'
import { PLACEMENT_QUESTIONS, scorePlacementTest } from './content/placementTest'

// Mélange les options une seule fois par question (sinon la bonne réponse est toujours
// en premier, ce qui rend le test trivial à deviner).
function shuffleQuestions() {
  return PLACEMENT_QUESTIONS.map((q) => {
    const order = q.options.map((_, i) => i)
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]]
    }
    return { ...q, options: order.map((i) => q.options[i]), correct: order.indexOf(q.correct) }
  })
}

export default function PlacementTest({ onFinish }) {
  const [questions] = useState(shuffleQuestions)
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState([])
  const question = questions[index]
  const progress = Math.round((index / questions.length) * 100)

  function choose(optionIndex) {
    const next = [...answers, optionIndex]
    if (index + 1 < questions.length) {
      setAnswers(next)
      setIndex(index + 1)
    } else {
      onFinish(scorePlacementTest(next, questions))
    }
  }

  return (
    <div className="card">
      <div className="progress-bar"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
      <p className="muted">Question {index + 1} / {questions.length}</p>
      <h2>{question.prompt}</h2>
      <div className="options">
        {question.options.map((opt, i) => (
          <button key={i} className="option" onClick={() => choose(i)}>{opt}</button>
        ))}
      </div>
    </div>
  )
}
