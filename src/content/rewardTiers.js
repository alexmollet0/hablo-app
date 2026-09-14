// Paliers de récompense pondérés, partagés entre la machine à sous, la roue quotidienne et les
// coffres — un seul tirage aléatoire à maintenir plutôt que trois copies.
export const TIERS = [
  { key: 'commun', label: 'Commun', emoji: '🍒', weight: 60, coins: 5 },
  { key: 'rare', label: 'Rare', emoji: '🔔', weight: 25, coins: 15 },
  { key: 'epique', label: 'Épique', emoji: '💎', weight: 12, coins: 40 },
  { key: 'legendaire', label: 'Légendaire', emoji: '👑', weight: 3, coins: 100 },
]

export function drawTier() {
  const totalWeight = TIERS.reduce((sum, t) => sum + t.weight, 0)
  let roll = Math.random() * totalWeight
  for (const tier of TIERS) {
    if (roll < tier.weight) return tier
    roll -= tier.weight
  }
  return TIERS[0]
}
