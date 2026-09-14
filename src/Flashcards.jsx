import { useEffect, useMemo, useState } from 'react'
import { supabase } from './supabaseClient'
import { LANGUAGES, getWord } from './content/language'
import { initCardProgress, reviewCard, isDue } from './leitner'

export default function Flashcards({ userId, language, variant, level, onExit }) {
  const pool = useMemo(
    () => LANGUAGES[language].vocab.filter((c) => c.level <= level),
    [language, level]
  )
  const [loading, setLoading] = useState(true)
  const [progressByCard, setProgressByCard] = useState({})
  const [queue, setQueue] = useState([])
  const [flipped, setFlipped] = useState(false)
  const [reviewedCount, setReviewedCount] = useState(0)

  useEffect(() => {
    let cancelled = false
    async function load() {
      const { data, error } = await supabase
        .from('card_progress')
        .select('card_id, box, due_date')
        .eq('user_id', userId)
      if (error) console.error(error)
      if (cancelled) return
      const map = {}
      for (const row of data || []) map[row.card_id] = row
      setProgressByCard(map)
      const due = pool.filter((c) => !map[c.id] || isDue(map[c.id]))
      setQueue(shuffle(due))
      setLoading(false)
    }
    load()
    return () => { cancelled = true }
  }, [userId, pool])

  async function answer(correct) {
    const current = queue[0]
    const prev = progressByCard[current.id] || initCardProgress(current.id)
    const next = reviewCard(prev, correct)
    setProgressByCard({ ...progressByCard, [current.id]: next })
    setQueue(queue.slice(1))
    setFlipped(false)
    setReviewedCount((n) => n + 1)
    const { error } = await supabase.from('card_progress').upsert({
      user_id: userId,
      card_id: current.id,
      box: next.box,
      due_date: next.dueDate,
    }, { onConflict: 'user_id,card_id' })
    if (error) console.error(error)
  }

  if (loading) return <div className="screen-center">Chargement…</div>

  if (queue.length === 0) {
    return (
      <div className="screen-center">
        <div className="card center">
          <h2>{reviewedCount > 0 ? 'Bravo, tout est révisé pour aujourd’hui ! 🎉' : 'Rien à réviser pour l’instant 👍'}</h2>
          <p className="muted">Reviens plus tard pour la suite.</p>
          <button onClick={onExit}>Retour</button>
        </div>
      </div>
    )
  }

  const card = queue[0]

  return (
    <div className="screen-center">
      <div className="card center flashcard">
        <p className="muted">{card.topic} · {queue.length} restante{queue.length > 1 ? 's' : ''}</p>
        <h1>{getWord(card, language, variant)}</h1>
        {flipped && <p className="translation">{card.fr}</p>}
        {!flipped && (
          <button onClick={() => setFlipped(true)}>Retourner la carte</button>
        )}
        {flipped && (
          <div className="answer-buttons">
            <button className="danger" onClick={() => answer(false)}>À revoir ❌</button>
            <button className="success" onClick={() => answer(true)}>Je savais ✅</button>
          </div>
        )}
        <button className="link" onClick={onExit}>Quitter</button>
      </div>
    </div>
  )
}

function shuffle(arr) {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}
