import { useState } from 'react'
import { supabase } from './supabaseClient'
import PlacementTest from './PlacementTest'
import { levelTier } from './content/level'
import { LANGUAGES } from './content/language'

export default function Onboarding({ userId, onDone }) {
  const [step, setStep] = useState('language') // 'language' | 'variant' | 'test' | 'result'
  const [language, setLanguage] = useState(null)
  const [variant, setVariant] = useState(null)
  const [level, setLevel] = useState(null)
  const [saving, setSaving] = useState(false)

  function chooseLanguage(lang) {
    setLanguage(lang)
    setStep(LANGUAGES[lang].hasVariant ? 'variant' : 'test')
  }

  async function finishTest(computedLevel) {
    setLevel(computedLevel)
    setStep('result')
    setSaving(true)
    const { error } = await supabase.from('profiles').upsert({
      id: userId,
      target_language: language,
      variant: LANGUAGES[language].hasVariant ? variant : null,
      level: computedLevel,
      onboarded: true,
    })
    setSaving(false)
    if (error) console.error(error)
  }

  if (step === 'language') {
    return (
      <div className="screen-center">
        <div className="card">
          <h1>¿Qué quieres aprender? 🌍</h1>
          <p className="muted">Choisis la langue que tu veux apprendre (tu pourras en ajouter d'autres plus tard).</p>
          <div className="variant-choice">
            <button className="option" onClick={() => chooseLanguage('es')}>🇪🇸 Español</button>
            <button className="option" onClick={() => chooseLanguage('en')}>🇬🇧 English</button>
          </div>
        </div>
      </div>
    )
  }

  if (step === 'variant') {
    return (
      <div className="screen-center">
        <div className="card">
          <h1>¿De dónde eres? 🌎</h1>
          <p className="muted">Choisis la variante d'espagnol que tu veux apprendre (tu pourras changer plus tard).</p>
          <div className="variant-choice">
            <button className="option" onClick={() => { setVariant('ES'); setStep('test') }}>
              🇪🇸 Espagnol d'Espagne
            </button>
            <button className="option" onClick={() => { setVariant('LatAm'); setStep('test') }}>
              🌎 Espagnol d'Amérique Latine
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (step === 'test') {
    return (
      <div className="screen-center">
        <div>
          <p className="muted center">Petit test pour connaître ton niveau de départ (2 minutes).</p>
          <PlacementTest sourceQuestions={LANGUAGES[language].questions} onFinish={finishTest} />
        </div>
      </div>
    )
  }

  return (
    <div className="screen-center">
      <div className="card center">
        <h1>¡Listo! 🎉</h1>
        <p>Ton niveau de départ : <strong>{levelTier(level)}</strong> (niveau {level}/9)</p>
        <button
          disabled={saving}
          onClick={() => onDone({
            id: userId,
            target_language: language,
            variant: LANGUAGES[language].hasVariant ? variant : null,
            level,
            onboarded: true,
            coins: 0,
          })}
        >
          {saving ? 'Enregistrement…' : 'Commencer'}
        </button>
      </div>
    </div>
  )
}
