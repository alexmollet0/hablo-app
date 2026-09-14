import { VOCAB as VOCAB_ES, wordFor as wordForEs } from './vocabEs'
import { VOCAB as VOCAB_EN, wordFor as wordForEn } from './vocabEn'
import { PLACEMENT_QUESTIONS as PLACEMENT_ES } from './placementTestEs'
import { PLACEMENT_QUESTIONS as PLACEMENT_EN } from './placementTestEn'

// Registre central : une langue cible = un vocabulaire + un test de niveau + si elle a des
// variantes régionales (seul l'espagnol en a pour l'instant).
export const LANGUAGES = {
  es: { label: 'Español', vocab: VOCAB_ES, questions: PLACEMENT_ES, hasVariant: true },
  en: { label: 'English', vocab: VOCAB_EN, questions: PLACEMENT_EN, hasVariant: false },
}

// Accesseur unique : renvoie le mot dans la langue cible (et la variante si pertinent).
export function getWord(card, lang, variant) {
  return lang === 'es' ? wordForEs(card, variant) : wordForEn(card)
}
