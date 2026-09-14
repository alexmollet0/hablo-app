// Logique de score/niveau partagée entre toutes les langues (indépendante du contenu).

// answers: tableau d'index choisis. `questions` : jeu de questions utilisé (éventuellement
// mélangé, voir PlacementTest.jsx — doit garder les mêmes champs `level`/`correct` recalculés).
export function scorePlacementTest(answers, questions) {
  const totalWeight = questions.reduce((sum, q) => sum + q.level, 0)
  const score = questions.reduce((sum, q, i) => {
    return sum + (answers[i] === q.correct ? q.level : 0)
  }, 0)
  const level = Math.round((score / totalWeight) * 9)
  return Math.min(9, Math.max(1, level || 1))
}

export function levelTier(level) {
  if (level <= 3) return 'facile'
  if (level <= 6) return 'intermediaire'
  return 'difficile'
}
