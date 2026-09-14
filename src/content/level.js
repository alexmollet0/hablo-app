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

export const MAX_LEVEL = 9

// XP nécessaire pour passer de `level` à `level + 1`.
export function xpToNextLevel(level) {
  return 100 + (level - 1) * 50
}

// Applique un gain d'XP à un profil, fait monter le niveau (et cumule les récompenses en
// pièces) autant de fois que nécessaire si le gain est important. Plafonne au niveau max.
export function applyXp(profile, gained) {
  let level = profile.level
  let xp = profile.xp + gained
  let coinsAwarded = 0

  while (level < MAX_LEVEL && xp >= xpToNextLevel(level)) {
    xp -= xpToNextLevel(level)
    level += 1
    coinsAwarded += 50 * level
  }
  if (level >= MAX_LEVEL) xp = 0

  return { xp, level, coinsAwarded, leveledUp: coinsAwarded > 0 }
}
