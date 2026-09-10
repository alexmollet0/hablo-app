// Répétition espacée simplifiée (système de Leitner à 4 boîtes).
// Boîte 1 = à revoir tout de suite, boîte 4 = quasi maîtrisée.
const BOX_INTERVALS_DAYS = [0, 1, 3, 7]
const MAX_BOX = BOX_INTERVALS_DAYS.length

export function initCardProgress(cardId) {
  return { cardId, box: 1, dueDate: todayISO() }
}

export function reviewCard(progress, correct) {
  const nextBox = correct ? Math.min(progress.box + 1, MAX_BOX) : 1
  return {
    ...progress,
    box: nextBox,
    dueDate: addDaysISO(BOX_INTERVALS_DAYS[nextBox - 1]),
  }
}

export function isDue(progress) {
  return progress.dueDate <= todayISO()
}

export function isMastered(progress) {
  return progress.box === MAX_BOX
}

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

function addDaysISO(days) {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}
