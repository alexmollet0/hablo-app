import { useEffect, useState } from 'react'
import AuthGate from './Auth'
import { supabase } from './supabaseClient'
import Onboarding from './Onboarding'
import Flashcards from './Flashcards'
import QuizGame from './games/QuizGame'
import { levelTier } from './content/placementTest'
import './App.css'

export default function App() {
  return (
    <AuthGate>
      <Loaded />
    </AuthGate>
  )
}

function Loaded() {
  const [userId, setUserId] = useState(null)
  const [profile, setProfile] = useState(undefined) // undefined = chargement, null = pas de profil

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id))
  }, [])

  useEffect(() => {
    if (!userId) return
    supabase.from('profiles').select('*').eq('id', userId).maybeSingle().then(({ data, error }) => {
      if (error) console.error(error)
      setProfile(data || null)
    })
  }, [userId])

  if (!userId || profile === undefined) return <div className="screen-center">Chargement…</div>

  if (!profile || !profile.onboarded) {
    return <Onboarding userId={userId} onDone={setProfile} />
  }

  return <MainApp profile={profile} />
}

function MainApp({ profile }) {
  const [view, setView] = useState('home') // 'home' | 'flashcards' | 'quiz'

  if (view === 'flashcards') {
    return <Flashcards userId={profile.id} variant={profile.variant} level={profile.level} onExit={() => setView('home')} />
  }
  if (view === 'quiz') {
    return <QuizGame variant={profile.variant} level={profile.level} onExit={() => setView('home')} />
  }

  return (
    <div className="screen-center">
      <div className="card center">
        <h1>¡Hola! 👋</h1>
        <p className="muted">
          Niveau {profile.level}/9 · {levelTier(profile.level)} · {profile.variant === 'ES' ? 'Espagne 🇪🇸' : 'Amérique Latine 🌎'}
        </p>
        <div className="menu">
          <button onClick={() => setView('flashcards')}>📇 Réviser mes flashcards</button>
          <button onClick={() => setView('quiz')}>🎮 Jouer au quiz</button>
        </div>
        <button className="link" onClick={() => supabase.auth.signOut()}>Se déconnecter</button>
      </div>
    </div>
  )
}
