// Boutique : avatar, accessoires, maison. Un objet gratuit par catégorie (possédé/équipé dès
// l'inscription, voir Onboarding.jsx) pour matérialiser le départ "presque à poil".
export const SHOP_CATEGORIES = [
  { key: 'avatar', label: 'Avatar' },
  { key: 'accessoire', label: 'Accessoires' },
  { key: 'maison', label: 'Maison' },
]

export const SHOP_ITEMS = [
  // Avatar
  { id: 'avatar_default', category: 'avatar', name: 'Toi-même', emoji: '🧑', price: 0 },
  { id: 'avatar_cool', category: 'avatar', name: 'Cool', emoji: '😎', price: 150 },
  { id: 'avatar_astro', category: 'avatar', name: 'Astronaute', emoji: '🧑‍🚀', price: 400 },
  { id: 'avatar_chef', category: 'avatar', name: 'Chef cuisinier', emoji: '🧑‍🍳', price: 400 },
  { id: 'avatar_rockstar', category: 'avatar', name: 'Rockstar', emoji: '🧑‍🎤', price: 800 },
  { id: 'avatar_royal', category: 'avatar', name: 'Royauté', emoji: '🤴', price: 2000 },

  // Accessoire
  { id: 'acc_none', category: 'accessoire', name: 'Aucun', emoji: '', price: 0 },
  { id: 'acc_glasses', category: 'accessoire', name: 'Lunettes de soleil', emoji: '🕶️', price: 100 },
  { id: 'acc_hat', category: 'accessoire', name: 'Chapeau', emoji: '🎩', price: 250 },
  { id: 'acc_wings', category: 'accessoire', name: 'Ailes', emoji: '🦋', price: 1500 },
  { id: 'acc_crown', category: 'accessoire', name: 'Couronne', emoji: '👑', price: 3000 },

  // Maison
  { id: 'house_rue', category: 'maison', name: 'La rue', emoji: '🌳', price: 0 },
  { id: 'house_chambre', category: 'maison', name: "Chambre chez un ami", emoji: '🛏️', price: 200 },
  { id: 'house_studio', category: 'maison', name: 'Studio', emoji: '🏚️', price: 800 },
  { id: 'house_appartement', category: 'maison', name: 'Appartement', emoji: '🏢', price: 3000 },
  { id: 'house_villa', category: 'maison', name: 'Villa', emoji: '🏡', price: 10000 },
  { id: 'house_chateau', category: 'maison', name: 'Château', emoji: '🏰', price: 50000 },
]

// Objet gratuit de départ pour une catégorie (premier item à price: 0).
export function defaultItem(category) {
  return SHOP_ITEMS.find((it) => it.category === category && it.price === 0)
}

export function itemsForCategory(category) {
  return SHOP_ITEMS.filter((it) => it.category === category)
}

export function getItem(id) {
  return SHOP_ITEMS.find((it) => it.id === id)
}

// Objet équipé pour une catégorie, avec repli sur l'objet gratuit si rien d'équipé
// (profils créés avant l'ajout de la boutique, `equipped` vide).
export function getEquipped(profile, category) {
  const equippedId = profile?.equipped?.[category]
  return (equippedId && getItem(equippedId)) || defaultItem(category)
}
