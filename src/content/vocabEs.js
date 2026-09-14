// Vocabulaire de départ, organisé par niveau (1-9) et thème.
// `es` = forme commune aux deux variantes. `variant: { ES, LatAm }` = quand le mot diffère
// vraiment entre espagnol d'Espagne et d'Amérique Latine (sinon on garde juste `es`).
export const VOCAB = [
  // Niveau 1 — Salutations
  { id: 'v1', level: 1, topic: 'Salutations', es: 'hola', fr: 'salut / bonjour' },
  { id: 'v2', level: 1, topic: 'Salutations', es: 'buenos días', fr: 'bonjour (le matin)' },
  { id: 'v3', level: 1, topic: 'Salutations', es: 'buenas noches', fr: 'bonsoir / bonne nuit' },
  { id: 'v4', level: 1, topic: 'Salutations', es: 'gracias', fr: 'merci' },
  { id: 'v5', level: 1, topic: 'Salutations', es: 'por favor', fr: 's’il te/vous plaît' },
  { id: 'v6', level: 1, topic: 'Salutations', es: 'adiós', fr: 'au revoir' },

  // Niveau 2 — Bases
  { id: 'v7', level: 2, topic: 'Bases', es: 'uno', fr: 'un' },
  { id: 'v8', level: 2, topic: 'Bases', es: 'dos', fr: 'deux' },
  { id: 'v9', level: 2, topic: 'Bases', es: 'tres', fr: 'trois' },
  { id: 'v10', level: 2, topic: 'Bases', es: 'sí', fr: 'oui' },
  { id: 'v11', level: 2, topic: 'Bases', es: 'no', fr: 'non' },
  { id: 'v12', level: 2, topic: 'Bases', es: '¿cómo estás?', fr: 'comment vas-tu ?' },

  // Niveau 3 — Famille
  { id: 'v13', level: 3, topic: 'Famille', es: 'madre', fr: 'mère' },
  { id: 'v14', level: 3, topic: 'Famille', es: 'padre', fr: 'père' },
  { id: 'v15', level: 3, topic: 'Famille', es: 'hermana', fr: 'sœur' },
  { id: 'v16', level: 3, topic: 'Famille', es: 'hermano', fr: 'frère' },
  { id: 'v17', level: 3, topic: 'Famille', es: 'amigo', fr: 'ami' },

  // Niveau 4 — Nourriture
  { id: 'v18', level: 4, topic: 'Nourriture', es: 'agua', fr: 'eau' },
  { id: 'v19', level: 4, topic: 'Nourriture', es: 'pan', fr: 'pain' },
  { id: 'v20', level: 4, topic: 'Nourriture', es: 'manzana', fr: 'pomme' },
  { id: 'v21', level: 4, topic: 'Nourriture', es: 'pollo', fr: 'poulet' },
  { id: 'v22', level: 4, topic: 'Nourriture', es: 'queso', fr: 'fromage' },
  { id: 'v23', level: 4, topic: 'Nourriture', es: 'huevo', fr: 'œuf' },

  // Niveau 5 — Vie quotidienne (ici, les vraies différences Espagne / Amérique Latine)
  { id: 'v24', level: 5, topic: 'Vie quotidienne', variant: { ES: 'coche', LatAm: 'carro' }, fr: 'voiture' },
  { id: 'v25', level: 5, topic: 'Vie quotidienne', variant: { ES: 'ordenador', LatAm: 'computadora' }, fr: 'ordinateur' },
  { id: 'v26', level: 5, topic: 'Vie quotidienne', variant: { ES: 'móvil', LatAm: 'celular' }, fr: 'téléphone portable' },
  { id: 'v27', level: 5, topic: 'Vie quotidienne', variant: { ES: 'zumo', LatAm: 'jugo' }, fr: 'jus' },
  { id: 'v28', level: 5, topic: 'Vie quotidienne', variant: { ES: 'patata', LatAm: 'papa' }, fr: 'pomme de terre' },

  // Niveau 6 — Travail
  { id: 'v29', level: 6, topic: 'Travail', es: 'trabajo', fr: 'travail' },
  { id: 'v30', level: 6, topic: 'Travail', es: 'oficina', fr: 'bureau' },
  { id: 'v31', level: 6, topic: 'Travail', es: 'reunión', fr: 'réunion' },
  { id: 'v32', level: 6, topic: 'Travail', es: 'jefe', fr: 'chef / patron' },
  { id: 'v33', level: 6, topic: 'Travail', es: 'empleado', fr: 'employé' },

  // Niveau 7 — Voyage
  { id: 'v34', level: 7, topic: 'Voyage', es: 'pasaporte', fr: 'passeport' },
  { id: 'v35', level: 7, topic: 'Voyage', es: 'equipaje', fr: 'bagage' },
  { id: 'v36', level: 7, topic: 'Voyage', es: 'vuelo', fr: 'vol (avion)' },
  { id: 'v37', level: 7, topic: 'Voyage', es: 'aeropuerto', fr: 'aéroport' },
  { id: 'v38', level: 7, topic: 'Voyage', variant: { ES: 'billete', LatAm: 'boleto' }, fr: 'billet' },

  // Niveau 8 — Connecteurs (expressions avancées)
  { id: 'v39', level: 8, topic: 'Connecteurs', es: 'aunque', fr: 'bien que / même si' },
  { id: 'v40', level: 8, topic: 'Connecteurs', es: 'sin embargo', fr: 'cependant' },
  { id: 'v41', level: 8, topic: 'Connecteurs', es: 'a pesar de', fr: 'malgré' },
  { id: 'v42', level: 8, topic: 'Connecteurs', es: 'por lo tanto', fr: 'par conséquent' },
  { id: 'v43', level: 8, topic: 'Connecteurs', es: 'de hecho', fr: 'en fait' },

  // Niveau 9 — Expressions idiomatiques
  { id: 'v44', level: 9, topic: 'Expressions', es: 'no hay de qué', fr: 'de rien / il n’y a pas de quoi' },
  { id: 'v45', level: 9, topic: 'Expressions', es: '¡qué va!', fr: 'allons donc ! / pas du tout !' },
  { id: 'v46', level: 9, topic: 'Expressions', es: 'meter la pata', fr: 'faire une gaffe' },
  { id: 'v47', level: 9, topic: 'Expressions', es: 'estar hasta las narices', fr: 'en avoir marre' },
  { id: 'v48', level: 9, topic: 'Expressions', es: 'tener mala leche', fr: 'être de mauvaise humeur' },
]

// Retourne le mot espagnol adapté à la variante choisie par l'utilisateur ('ES' ou 'LatAm').
export function wordFor(card, variant) {
  if (card.variant) return card.variant[variant] || card.variant.ES
  return card.es
}
