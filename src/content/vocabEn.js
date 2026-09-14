// Vocabulaire anglais, même structure que vocabEs.js (mêmes id/level/topic/fr) pour rester
// alignés sur la même échelle de niveaux. Pas de distinction de variante (UK/US) pour l'instant.
export const VOCAB = [
  // Niveau 1 — Salutations
  { id: 'v1', level: 1, topic: 'Salutations', en: 'hello', fr: 'salut / bonjour' },
  { id: 'v2', level: 1, topic: 'Salutations', en: 'good morning', fr: 'bonjour (le matin)' },
  { id: 'v3', level: 1, topic: 'Salutations', en: 'good evening', fr: 'bonsoir / bonne nuit' },
  { id: 'v4', level: 1, topic: 'Salutations', en: 'thank you', fr: 'merci' },
  { id: 'v5', level: 1, topic: 'Salutations', en: 'please', fr: 's’il te/vous plaît' },
  { id: 'v6', level: 1, topic: 'Salutations', en: 'goodbye', fr: 'au revoir' },

  // Niveau 2 — Bases
  { id: 'v7', level: 2, topic: 'Bases', en: 'one', fr: 'un' },
  { id: 'v8', level: 2, topic: 'Bases', en: 'two', fr: 'deux' },
  { id: 'v9', level: 2, topic: 'Bases', en: 'three', fr: 'trois' },
  { id: 'v10', level: 2, topic: 'Bases', en: 'yes', fr: 'oui' },
  { id: 'v11', level: 2, topic: 'Bases', en: 'no', fr: 'non' },
  { id: 'v12', level: 2, topic: 'Bases', en: 'how are you?', fr: 'comment vas-tu ?' },

  // Niveau 3 — Famille
  { id: 'v13', level: 3, topic: 'Famille', en: 'mother', fr: 'mère' },
  { id: 'v14', level: 3, topic: 'Famille', en: 'father', fr: 'père' },
  { id: 'v15', level: 3, topic: 'Famille', en: 'sister', fr: 'sœur' },
  { id: 'v16', level: 3, topic: 'Famille', en: 'brother', fr: 'frère' },
  { id: 'v17', level: 3, topic: 'Famille', en: 'friend', fr: 'ami' },

  // Niveau 4 — Nourriture
  { id: 'v18', level: 4, topic: 'Nourriture', en: 'water', fr: 'eau' },
  { id: 'v19', level: 4, topic: 'Nourriture', en: 'bread', fr: 'pain' },
  { id: 'v20', level: 4, topic: 'Nourriture', en: 'apple', fr: 'pomme' },
  { id: 'v21', level: 4, topic: 'Nourriture', en: 'chicken', fr: 'poulet' },
  { id: 'v22', level: 4, topic: 'Nourriture', en: 'cheese', fr: 'fromage' },
  { id: 'v23', level: 4, topic: 'Nourriture', en: 'egg', fr: 'œuf' },

  // Niveau 5 — Vie quotidienne
  { id: 'v24', level: 5, topic: 'Vie quotidienne', en: 'car', fr: 'voiture' },
  { id: 'v25', level: 5, topic: 'Vie quotidienne', en: 'computer', fr: 'ordinateur' },
  { id: 'v26', level: 5, topic: 'Vie quotidienne', en: 'mobile phone', fr: 'téléphone portable' },
  { id: 'v27', level: 5, topic: 'Vie quotidienne', en: 'juice', fr: 'jus' },
  { id: 'v28', level: 5, topic: 'Vie quotidienne', en: 'potato', fr: 'pomme de terre' },

  // Niveau 6 — Travail
  { id: 'v29', level: 6, topic: 'Travail', en: 'work', fr: 'travail' },
  { id: 'v30', level: 6, topic: 'Travail', en: 'office', fr: 'bureau' },
  { id: 'v31', level: 6, topic: 'Travail', en: 'meeting', fr: 'réunion' },
  { id: 'v32', level: 6, topic: 'Travail', en: 'boss', fr: 'chef / patron' },
  { id: 'v33', level: 6, topic: 'Travail', en: 'employee', fr: 'employé' },

  // Niveau 7 — Voyage
  { id: 'v34', level: 7, topic: 'Voyage', en: 'passport', fr: 'passeport' },
  { id: 'v35', level: 7, topic: 'Voyage', en: 'luggage', fr: 'bagage' },
  { id: 'v36', level: 7, topic: 'Voyage', en: 'flight', fr: 'vol (avion)' },
  { id: 'v37', level: 7, topic: 'Voyage', en: 'airport', fr: 'aéroport' },
  { id: 'v38', level: 7, topic: 'Voyage', en: 'ticket', fr: 'billet' },

  // Niveau 8 — Connecteurs
  { id: 'v39', level: 8, topic: 'Connecteurs', en: 'although', fr: 'bien que / même si' },
  { id: 'v40', level: 8, topic: 'Connecteurs', en: 'however', fr: 'cependant' },
  { id: 'v41', level: 8, topic: 'Connecteurs', en: 'despite', fr: 'malgré' },
  { id: 'v42', level: 8, topic: 'Connecteurs', en: 'therefore', fr: 'par conséquent' },
  { id: 'v43', level: 8, topic: 'Connecteurs', en: 'in fact', fr: 'en fait' },

  // Niveau 9 — Expressions idiomatiques
  { id: 'v44', level: 9, topic: 'Expressions', en: 'you’re welcome', fr: 'de rien / il n’y a pas de quoi' },
  { id: 'v45', level: 9, topic: 'Expressions', en: 'no way!', fr: 'allons donc ! / pas du tout !' },
  { id: 'v46', level: 9, topic: 'Expressions', en: 'to put one’s foot in it', fr: 'faire une gaffe' },
  { id: 'v47', level: 9, topic: 'Expressions', en: 'to be fed up', fr: 'en avoir marre' },
  { id: 'v48', level: 9, topic: 'Expressions', en: 'to be in a bad mood', fr: 'être de mauvaise humeur' },
]

export function wordFor(card) {
  return card.en
}
