import { createAvatar } from '@dicebear/core'
import { micah } from '@dicebear/collection'
import { getEquipped } from './content/shopItems'

// Traits non achetables en v1 (visage/carnation/yeux/bouche...) : fixés par le seed (id du
// compte), différents pour chaque utilisateur sans qu'on ait à les vendre.
const BASE_OPTIONS = {
  facialHairProbability: 0,
}

// Combine les options DiceBear des objets équipés (coiffure/vêtements/lunettes/boucles),
// avec la possibilité de remplacer temporairement UNE catégorie (aperçu boutique avant achat).
export function buildDicebearOptions(profile, overrides = {}) {
  const options = { seed: profile.id, ...BASE_OPTIONS }
  for (const category of ['hair', 'shirt', 'glasses', 'earrings']) {
    const item = overrides[category] || getEquipped(profile, category)
    Object.assign(options, item.options)
  }
  return options
}

export function avatarDataUri(options) {
  return createAvatar(micah, options).toDataUri()
}
