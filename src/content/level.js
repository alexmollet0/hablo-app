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

// Plafond d'XP gagnable par jour (calendaire) — sans ça, rejouer le quiz en boucle permet
// d'atteindre le niveau max en quelques minutes ; les flashcards sont déjà limitées naturellement
// par la répétition espacée (une carte revue aujourd'hui n'est plus due avant demain).
export const DAILY_XP_CAP = 150

// Même contrat que applyXp, mais plafonne le gain réel à ce qu'il reste de budget XP du jour
// (réinitialisé si `xp_today_date` n'est pas aujourd'hui). `todayIso` : date du jour, format
// YYYY-MM-DD (voir todayISO dans leitner.js pour le même format).
export function applyDailyXp(profile, gained, todayIso) {
  const sameDay = profile.xp_today_date === todayIso
  const xpToday = sameDay ? profile.xp_today : 0
  const allowed = Math.max(0, DAILY_XP_CAP - xpToday)
  const actualGain = Math.min(gained, allowed)

  const result = applyXp(profile, actualGain)
  return {
    ...result,
    xpToday: xpToday + actualGain,
    xpTodayDate: todayIso,
    capped: actualGain < gained,
  }
}
