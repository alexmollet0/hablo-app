import { useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from './supabaseClient'

export default function AuthGate({ children }) {
  const [session, setSession] = useState(undefined) // undefined = chargement

  useEffect(() => {
    if (!isSupabaseConfigured) return
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => setSession(s))
    return () => sub.subscription.unsubscribe()
  }, [])

  if (!isSupabaseConfigured) {
    return (
      <div className="screen-center">
        <div className="card center">
          <h1>Configuration manquante</h1>
          <p className="muted">
            Renseigne <code>VITE_SUPABASE_URL</code> et <code>VITE_SUPABASE_ANON_KEY</code> dans <code>.env.local</code> puis relance le serveur.
          </p>
        </div>
      </div>
    )
  }

  if (session === undefined) return <div className="screen-center">Chargement…</div>
  if (!session) return <AuthForm />
  return children
}

function AuthForm() {
  const [mode, setMode] = useState('password') // 'password' | 'code'
  const [step, setStep] = useState('signin') // 'signin' | 'signup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [codeSent, setCodeSent] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handlePasswordSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const action = step === 'signup'
      ? supabase.auth.signUp({ email, password })
      : supabase.auth.signInWithPassword({ email, password })
    const { error } = await action
    setLoading(false)
    if (error) setError(traduireErreur(error.message))
  }

  async function handleSendCode(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await supabase.auth.signInWithOtp({ email })
    setLoading(false)
    if (error) setError(traduireErreur(error.message))
    else setCodeSent(true)
  }

  async function handleVerifyCode(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await supabase.auth.verifyOtp({ email, token: code, type: 'email' })
    setLoading(false)
    if (error) setError(traduireErreur(error.message))
  }

  return (
    <div className="screen-center">
      <div className="auth-card">
        <h1>¡Hola! 👋</h1>
        <p className="muted">Apprends l'espagnol en t'amusant.</p>

        <div className="tabs">
          <button className={mode === 'password' ? 'tab active' : 'tab'} onClick={() => setMode('password')}>
            Mot de passe
          </button>
          <button className={mode === 'code' ? 'tab active' : 'tab'} onClick={() => setMode('code')}>
            Code par email
          </button>
        </div>

        {mode === 'password' && (
          <form onSubmit={handlePasswordSubmit} className="form">
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
            {error && <p className="error">{error}</p>}
            <button type="submit" disabled={loading}>
              {step === 'signup' ? 'Créer mon compte' : 'Se connecter'}
            </button>
            <button type="button" className="link" onClick={() => setStep(step === 'signup' ? 'signin' : 'signup')}>
              {step === 'signup' ? 'J’ai déjà un compte' : 'Créer un compte'}
            </button>
          </form>
        )}

        {mode === 'code' && !codeSent && (
          <form onSubmit={handleSendCode} className="form">
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            {error && <p className="error">{error}</p>}
            <button type="submit" disabled={loading}>Recevoir un code</button>
          </form>
        )}

        {mode === 'code' && codeSent && (
          <form onSubmit={handleVerifyCode} className="form">
            <p className="muted">Code envoyé à {email}, vérifie tes emails.</p>
            <input type="text" placeholder="Code à 6 chiffres" value={code} onChange={(e) => setCode(e.target.value)} required maxLength={6} />
            {error && <p className="error">{error}</p>}
            <button type="submit" disabled={loading}>Valider</button>
          </form>
        )}
      </div>
    </div>
  )
}

function traduireErreur(message) {
  if (/already registered/i.test(message)) return 'Un compte existe déjà avec cet email.'
  if (/invalid login credentials/i.test(message)) return 'Email ou mot de passe incorrect.'
  if (/token has expired|otp/i.test(message)) return 'Code invalide ou expiré.'
  return message
}
