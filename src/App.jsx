import { useEffect, useState } from 'react'
import AuthGate from './Auth'
import { supabase } from './supabaseClient'
import Onboarding from './Onboarding'
import Flashcards from './Flashcards'
import QuizGame from './games/QuizGame'
import SlotMachineGame from './games/SlotMachineGame'
import Shop from './Shop'
import AvatarDisplay from './AvatarDisplay'
import { levelTier } from './content/level'
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

  return <MainApp profile={profile} onProfileChange={setProfile} />
}

function MainApp({ profile, onProfileChange }) {
  const [view, setView] = useState('home') // 'home' | 'flashcards' | 'quiz' | 'slots' | 'shop'

  async function addCoins(amount) {
    const coins = profile.coins + amount
    onProfileChange({ ...profile, coins })
    const { error } = await supabase.from('profiles').update({ coins }).eq('id', profile.id)
    if (error) console.error(error)
  }

  async function buyItem(item) {
    const coins = profile.coins - item.price
    const owned_items = [...(profile.owned_items || []), item.id]
    const equipped = { ...profile.equipped, [item.category]: item.id }
    onProfileChange({ ...profile, coins, owned_items, equipped })
    const { error } = await supabase.from('profiles').update({ coins, owned_items, equipped }).eq('id', profile.id)
    if (error) console.error(error)
  }

  async function equipItem(item) {
    const equipped = { ...profile.equipped, [item.category]: item.id }
    onProfileChange({ ...profile, equipped })
    const { error } = await supabase.from('profiles').update({ equipped }).eq('id', profile.id)
    if (error) console.error(error)
  }

  const language = profile.target_language

  if (view === 'shop') {
    return (
      <Shop
        profile={profile}
        onBuy={buyItem}
        onEquip={equipItem}
        onExit={() => setView('home')}
      />
    )
  }

  if (view === 'flashcards') {
    return (
      <Flashcards
        userId={profile.id}
        language={language}
        variant={profile.variant}
        level={profile.level}
        onExit={() => setView('home')}
      />
    )
  }
  if (view === 'quiz') {
    return (
      <QuizGame
        language={language}
        variant={profile.variant}
        level={profile.level}
        onExit={() => setView('home')}
      />
    )
  }
  if (view === 'slots') {
    return (
      <SlotMachineGame
        language={language}
        variant={profile.variant}
        level={profile.level}
        onCoinsEarned={addCoins}
        onExit={() => setView('home')}
      />
    )
  }

  return (
    <div className="screen-center">
      <div className="card center">
        <h1>¡Hola! 👋</h1>
        <p className="muted">
          Niveau {profile.level}/9 · {levelTier(profile.level)} · {language === 'es' ? 'Español 🇪🇸' : 'English 🇬🇧'}
          {profile.variant ? ` · ${profile.variant === 'ES' ? 'Espagne' : 'Amérique Latine'}` : ''}
        </p>
        <AvatarDisplay profile={profile} />
        <p className="coins">🪙 {profile.coins}</p>
        <div className="menu">
          <button onClick={() => setView('flashcards')}>📇 Réviser mes flashcards</button>
          <button onClick={() => setView('quiz')}>🎮 Jouer au quiz</button>
          <button onClick={() => setView('slots')}>🎰 Machine à sous</button>
          <button onClick={() => setView('shop')}>🛍️ Boutique</button>
        </div>
        <button className="link" onClick={() => supabase.auth.signOut()}>Se déconnecter</button>
      </div>
    </div>
  )
}
