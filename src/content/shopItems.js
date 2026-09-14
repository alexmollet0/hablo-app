// Boutique : coiffure, vêtements, lunettes, boucles d'oreille (vraies options du style DiceBear
// "Micah", posées sur le personnage — voir avatarEngine.js) + maison (arrière-plan, statut).
// Palette de couleurs officielle du style Micah (voir node_modules/@dicebear/micah/lib/schema.js).
export const SHOP_CATEGORIES = [
  { key: 'hair', label: 'Coiffure' },
  { key: 'shirt', label: 'Vêtements' },
  { key: 'glasses', label: 'Lunettes' },
  { key: 'earrings', label: 'Boucles d’oreille' },
  { key: 'maison', label: 'Maison' },
]

export const SHOP_ITEMS = [
  // Coiffure (hair) — 8 formes du style Micah
  { id: 'hair_mrclean', category: 'hair', name: 'Crâne rasé', price: 0, options: { hair: ['mrClean'], hairColor: ['000000'] } },
  { id: 'hair_pixie', category: 'hair', name: 'Pixie brune', price: 150, options: { hair: ['pixie'], hairColor: ['77311d'] } },
  { id: 'hair_dougfunny', category: 'hair', name: 'Blonde bouclée', price: 200, options: { hair: ['dougFunny'], hairColor: ['f4d150'] } },
  { id: 'hair_turban', category: 'hair', name: 'Turban', price: 250, options: { hair: ['turban'], hairColor: ['000000'] } },
  { id: 'hair_dannyphantom', category: 'hair', name: 'Mèche blanche', price: 300, options: { hair: ['dannyPhantom'], hairColor: ['ffffff'] } },
  { id: 'hair_fonze', category: 'hair', name: 'Banane', price: 350, options: { hair: ['fonze'], hairColor: ['000000'] } },
  { id: 'hair_mrt', category: 'hair', name: 'Crête', price: 400, options: { hair: ['mrT'], hairColor: ['000000'] } },
  { id: 'hair_full', category: 'hair', name: 'Longue violette', price: 600, options: { hair: ['full'], hairColor: ['9287ff'] } },

  // Vêtements (shirt) — 3 formes × couleurs
  { id: 'shirt_white_crew', category: 'shirt', name: 'T-shirt blanc', price: 0, options: { shirt: ['crew'], shirtColor: ['ffffff'] } },
  { id: 'shirt_blue_crew', category: 'shirt', name: 'T-shirt bleu ciel', price: 100, options: { shirt: ['crew'], shirtColor: ['d2eff3'] } },
  { id: 'shirt_pink_crew', category: 'shirt', name: 'T-shirt rose', price: 100, options: { shirt: ['crew'], shirtColor: ['fc909f'] } },
  { id: 'shirt_black_crew', category: 'shirt', name: 'T-shirt noir', price: 150, options: { shirt: ['crew'], shirtColor: ['000000'] } },
  { id: 'shirt_white_collared', category: 'shirt', name: 'Chemise blanche', price: 200, options: { shirt: ['collared'], shirtColor: ['ffffff'] } },
  { id: 'shirt_brown_collared', category: 'shirt', name: 'Chemise marron', price: 250, options: { shirt: ['collared'], shirtColor: ['77311d'] } },
  { id: 'shirt_purple_collared', category: 'shirt', name: 'Chemise violette', price: 300, options: { shirt: ['collared'], shirtColor: ['9287ff'] } },
  { id: 'shirt_black_open', category: 'shirt', name: 'Veste ouverte noire', price: 400, options: { shirt: ['open'], shirtColor: ['000000'] } },
  { id: 'shirt_yellow_open', category: 'shirt', name: 'Veste ouverte jaune', price: 450, options: { shirt: ['open'], shirtColor: ['f4d150'] } },
  { id: 'shirt_cyan_open', category: 'shirt', name: 'Veste ouverte turquoise', price: 500, options: { shirt: ['open'], shirtColor: ['6bd9e9'] } },

  // Lunettes (glasses)
  { id: 'glasses_none', category: 'glasses', name: 'Aucune', price: 0, options: { glassesProbability: 0 } },
  { id: 'glasses_round', category: 'glasses', name: 'Lunettes rondes', price: 200, options: { glasses: ['round'], glassesColor: ['000000'], glassesProbability: 100 } },
  { id: 'glasses_square', category: 'glasses', name: 'Lunettes carrées', price: 200, options: { glasses: ['square'], glassesColor: ['000000'], glassesProbability: 100 } },

  // Boucles d'oreille (earrings)
  { id: 'earrings_none', category: 'earrings', name: 'Aucune', price: 0, options: { earringsProbability: 0 } },
  { id: 'earrings_stud', category: 'earrings', name: 'Puces dorées', price: 150, options: { earrings: ['stud'], earringColor: ['f4d150'], earringsProbability: 100 } },
  { id: 'earrings_hoop', category: 'earrings', name: 'Créoles dorées', price: 250, options: { earrings: ['hoop'], earringColor: ['f4d150'], earringsProbability: 100 } },

  // Maison (arrière-plan, statut) — progression, pas d'options DiceBear, juste un fond.
  { id: 'house_rue', category: 'maison', name: 'La rue', price: 0, bg: ['#cfd8c5', '#a9b79a'] },
  { id: 'house_chambre', category: 'maison', name: 'Chambre chez un ami', price: 200, bg: ['#e8ddc8', '#cdbb99'] },
  { id: 'house_studio', category: 'maison', name: 'Studio', price: 800, bg: ['#cfe3e8', '#8fb8c4'] },
  { id: 'house_appartement', category: 'maison', name: 'Appartement', price: 3000, bg: ['#c9e3d2', '#6fb894'] },
  { id: 'house_villa', category: 'maison', name: 'Villa', price: 10000, bg: ['#ffe3b0', '#f0a94e'] },
  { id: 'house_chateau', category: 'maison', name: 'Château', price: 50000, bg: ['#e6d3ff', '#a97bdb'] },
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
