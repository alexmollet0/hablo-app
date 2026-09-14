// Boutique : looks complets (générés par IA, voir scripts/generate-looks.mjs) + maisons
// (illustrations dessinées à la main, voir HouseIllustration.jsx). La richesse se montre par
// le logement (le plus cher du jeu), pas par la tenue.
export const SHOP_CATEGORIES = [
  { key: 'look', label: 'Looks' },
  { key: 'maison', label: 'Maison' },
]

export const SHOP_ITEMS = [
  // Looks (personnage complet, image statique générée une fois)
  { id: 'look_base', category: 'look', name: 'Look de base', price: 0, image: '/looks/look_base.webp' },
  { id: 'look_streetwear', category: 'look', name: 'Streetwear urbain', price: 200, image: '/looks/look_streetwear.webp' },
  { id: 'look_sportif', category: 'look', name: 'Sportif', price: 250, image: '/looks/look_sportif.webp' },
  { id: 'look_aventurier', category: 'look', name: 'Aventurier', price: 300, image: '/looks/look_aventurier.webp' },
  { id: 'look_elegant', category: 'look', name: 'Élégant soirée', price: 400, image: '/looks/look_elegant.webp' },
  { id: 'look_rockstar', category: 'look', name: 'Rockstar', price: 500, image: '/looks/look_rockstar.webp' },
  { id: 'look_cyberpunk', category: 'look', name: 'Cyberpunk néon', price: 700, image: '/looks/look_cyberpunk.webp' },
  { id: 'look_spatial', category: 'look', name: 'Futuriste spatial', price: 900, image: '/looks/look_spatial.webp' },
  { id: 'look_royal', category: 'look', name: 'Royal', price: 1500, image: '/looks/look_royal.webp' },
  { id: 'look_legendaire', category: 'look', name: 'Légendaire doré', price: 3000, image: '/looks/look_legendaire.webp' },

  // Maisons (arrière-plan, statut — illustration dans HouseIllustration.jsx)
  { id: 'house_rue', category: 'maison', name: 'La rue', price: 0 },
  { id: 'house_chambre', category: 'maison', name: 'Chambre chez un ami', price: 200 },
  { id: 'house_studio', category: 'maison', name: 'Studio', price: 800 },
  { id: 'house_appartement', category: 'maison', name: 'Appartement', price: 3000 },
  { id: 'house_villa', category: 'maison', name: 'Villa', price: 10000 },
  { id: 'house_chateau', category: 'maison', name: 'Château', price: 50000 },
]

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
// (profils créés avant l'ajout de la boutique/du système en couches, `equipped` vide ou
// pointant vers une ancienne catégorie qui n'existe plus).
export function getEquipped(profile, category) {
  const equippedId = profile?.equipped?.[category]
  return (equippedId && getItem(equippedId)) || defaultItem(category)
}
