import { getWord } from './language'

// Construit des questions à choix multiple (mot français → bonne traduction + 3 distracteurs),
// réutilisé par le quiz classique et la machine à sous.
export function buildQuizRounds(pool, lang, variant, count) {
  const shuffled = shuffle(pool).slice(0, Math.min(count, pool.length))
  return shuffled.map((card) => {
    const correct = getWord(card, lang, variant)
    const distractors = shuffle(pool.filter((c) => c.id !== card.id))
      .slice(0, 3)
      .map((c) => getWord(c, lang, variant))
    return { fr: card.fr, correct, options: shuffle([correct, ...distractors]) }
  })
}

export function shuffle(arr) {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}
