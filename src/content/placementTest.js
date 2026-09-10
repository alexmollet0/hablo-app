// Test de niveau à l'inscription : 15 questions, difficulté croissante (poids 1 à 9,
// aligné sur les 9 sous-niveaux du contenu — voir vocab.js). Commun aux deux variantes
// (Espagne/Amérique Latine) : aucune question ici ne dépend d'un mot qui diffère entre les deux.
export const PLACEMENT_QUESTIONS = [
  { id: 'p1', level: 1, prompt: '« Hola » veut dire :', options: ['Bonjour / Salut', 'Au revoir', 'Merci', 'Oui'], correct: 0 },
  { id: 'p2', level: 1, prompt: 'Comment dit-on « merci » ?', options: ['gracias', 'hola', 'adiós', 'por favor'], correct: 0 },
  { id: 'p3', level: 2, prompt: 'Quel est le pluriel de « el libro » (le livre) ?', options: ['los libros', 'las libros', 'el libros', 'los libro'], correct: 0 },
  { id: 'p4', level: 2, prompt: 'Conjugue « hablar » (parler) à la 1ère personne du singulier au présent :', options: ['hablo', 'hablas', 'habla', 'hablamos'], correct: 0 },
  { id: 'p5', level: 3, prompt: '« ¿Cómo te llamas? » veut dire :', options: ['Comment tu t’appelles ?', 'Comment vas-tu ?', 'Où habites-tu ?', 'Quel âge as-tu ?'], correct: 0 },
  { id: 'p6', level: 3, prompt: 'Comment dit-on « ma sœur » ?', options: ['mi hermana', 'mi hermano', 'mi madre', 'mi amiga'], correct: 0 },
  { id: 'p7', level: 4, prompt: 'Complète : « Yo ___ estudiante. »', options: ['soy', 'eres', 'es', 'somos'], correct: 0 },
  { id: 'p8', level: 4, prompt: 'Comment dit-on « je voudrais un café » ?', options: ['Quiero un café', 'Quiero un agua', 'Como un café', 'Bebo un té'], correct: 0 },
  { id: 'p9', level: 5, prompt: 'Passé (« pretérito ») de « comer » (manger) à la 3ème personne du singulier :', options: ['comió', 'come', 'comía', 'comerá'], correct: 0 },
  { id: 'p10', level: 5, prompt: 'Traduire : « Hier, je suis allé au marché. »', options: ['Ayer fui al mercado.', 'Ayer voy al mercado.', 'Ayer iré al mercado.', 'Ayer iba al mercado.'], correct: 0 },
  { id: 'p11', level: 6, prompt: 'Quelle phrase utilise correctement le subjonctif ?', options: ['Espero que tengas un buen día.', 'Espero que tienes un buen día.', 'Espero que tendrás un buen día.', 'Espero que tener un buen día.'], correct: 0 },
  { id: 'p12', level: 6, prompt: 'Traduire : « Bien que je sois fatigué, je vais travailler. »', options: ['Aunque esté cansado, voy a trabajar.', 'Aunque estoy cansado, voy a trabajar.', 'Aunque soy cansado, voy a trabajar.', 'Aunque cansado, voy a trabajar.'], correct: 0 },
  { id: 'p13', level: 7, prompt: 'Conditionnel de « poder » à « yo » :', options: ['podría', 'puedo', 'pude', 'podré'], correct: 0 },
  { id: 'p14', level: 8, prompt: 'Traduire : « Malgré la pluie, nous sommes sortis. »', options: ['A pesar de la lluvia, salimos.', 'A pesar de la lluvia, salgamos.', 'Sin embargo la lluvia, salimos.', 'Por lo tanto la lluvia, salimos.'], correct: 0 },
  { id: 'p15', level: 9, prompt: 'Que signifie l’expression « meter la pata » ?', options: ['Faire une gaffe', 'Mettre le pied', 'Partir en courant', 'Se fâcher'], correct: 0 },
]

// answers: tableau d'index choisis. `questions` (optionnel) permet de passer une version
// mélangée (voir PlacementTest.jsx) — doit garder les mêmes champs `level`/`correct` recalculés.
export function scorePlacementTest(answers, questions = PLACEMENT_QUESTIONS) {
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
