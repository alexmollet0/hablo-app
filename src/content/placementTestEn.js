// Test de niveau anglais à l'inscription : mêmes poids (1 à 9) que la version espagnole,
// pour rester comparables sur la même échelle de niveaux.
export const PLACEMENT_QUESTIONS = [
  { id: 'p1', level: 1, prompt: '« Hello » veut dire :', options: ['Bonjour / Salut', 'Au revoir', 'Merci', 'Oui'], correct: 0 },
  { id: 'p2', level: 1, prompt: 'Comment dit-on « merci » ?', options: ['thank you', 'hello', 'goodbye', 'please'], correct: 0 },
  { id: 'p3', level: 2, prompt: 'Quel est le pluriel de « child » (enfant) ?', options: ['children', 'childs', 'childes', 'child'], correct: 0 },
  { id: 'p4', level: 2, prompt: 'Conjugue « to speak » (parler) à la 1ère personne du singulier au présent :', options: ['I speak', 'he speaks', 'speaking', 'spoke'], correct: 0 },
  { id: 'p5', level: 3, prompt: '« What is your name? » veut dire :', options: ['Comment tu t’appelles ?', 'Comment vas-tu ?', 'Où habites-tu ?', 'Quel âge as-tu ?'], correct: 0 },
  { id: 'p6', level: 3, prompt: 'Comment dit-on « ma sœur » ?', options: ['my sister', 'my brother', 'my mother', 'my friend'], correct: 0 },
  { id: 'p7', level: 4, prompt: 'Complète : « I ___ a student. »', options: ['am', 'is', 'are', 'be'], correct: 0 },
  { id: 'p8', level: 4, prompt: 'Comment dit-on « je voudrais un café » ?', options: ['I would like a coffee', 'I would like some water', 'I eat a coffee', 'I drink a tea'], correct: 0 },
  { id: 'p9', level: 5, prompt: 'Passé de « to eat » (manger) à la 3ème personne du singulier :', options: ['ate', 'eats', 'eating', 'eaten'], correct: 0 },
  { id: 'p10', level: 5, prompt: 'Traduire : « Hier, je suis allé au marché. »', options: ['Yesterday, I went to the market.', 'Yesterday, I go to the market.', 'Yesterday, I will go to the market.', 'Yesterday, I was going to the market.'], correct: 0 },
  { id: 'p11', level: 6, prompt: 'Quelle phrase utilise correctement le présent parfait (present perfect) ?', options: ['I have finished my homework.', 'I have finish my homework.', 'I has finished my homework.', 'I finished has my homework.'], correct: 0 },
  { id: 'p12', level: 6, prompt: 'Traduire : « Bien que je sois fatigué, je vais travailler. »', options: ['Although I am tired, I will go to work.', 'Despite I am tired, I will go to work.', 'Even I am tired, I will go to work.', 'Tired although, I will go to work.'], correct: 0 },
  { id: 'p13', level: 7, prompt: 'Conditionnel de « can » (pouvoir) à « I » :', options: ['I could', 'I can', 'I canned', 'I will can'], correct: 0 },
  { id: 'p14', level: 8, prompt: 'Traduire : « Malgré la pluie, nous sommes sortis. »', options: ['Despite the rain, we went out.', 'Despite of the rain, we went out.', 'However the rain, we went out.', 'Therefore the rain, we went out.'], correct: 0 },
  { id: 'p15', level: 9, prompt: 'Que signifie l’expression « to put your foot in it » ?', options: ['Faire une gaffe', 'Avancer d’un pas', 'Partir en courant', 'Se fâcher'], correct: 0 },
]
