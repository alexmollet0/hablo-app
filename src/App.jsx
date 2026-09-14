import { useEffect, useState } from 'react'
import AuthGate from './Auth'
import { supabase } from './supabaseClient'
import Onboarding from './Onboarding'
import Flashcards from './Flashcards'
import QuizGame from './games/QuizGame'
import SlotMachineGame from './games/SlotMachineGame'
import Shop from './Shop'
import DailyWheel from './DailyWheel'
import Chests from './Chests'
import AvatarDisplay from './AvatarDisplay'
import LevelProgress from './LevelProgress'
import DailyChallenge from './games/DailyChallenge'
import { levelTier, applyDailyXp, DAILY_XP_CAP, applyDailyCoins, DAILY_COINS_CAP } from './content/level'
import './App.css'

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

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
  const [view, setView] = useState('home') // 'home' | 'flashcards' | 'quiz' | 'slots' | 'wheel' | 'chests' | 'challenge' | 'shop'
  const [levelUpNotice, setLevelUpNotice] = useState(null)

  // Plafonnée (DAILY_COINS_CAP) — utilisée UNIQUEMENT par les sources de pièces rejouables à
  // l'infini (machine à sous, ouverture de coffres). Renvoie {gained, capped} pour que
  // l'appelant puisse afficher le gain réel plutôt que le montant nominal du tirage.
  async function addCoins(amount) {
    const today = todayISO()
    const { coins, coinsToday, coinsTodayDate, gained, capped } = applyDailyCoins(
      { coins: profile.coins, coins_today: profile.coins_today || 0, coins_today_date: profile.coins_today_date },
      amount,
      today
    )
    onProfileChange({ ...profile, coins, coins_today: coinsToday, coins_today_date: coinsTodayDate })
    const { error } = await supabase.from('profiles')
      .update({ coins, coins_today: coinsToday, coins_today_date: coinsTodayDate })
      .eq('id', profile.id)
    if (error) console.error(error)
    return { gained, capped }
  }

  async function addXp(amount) {
    const today = todayISO()
    const { xp, level, coinsAwarded, leveledUp, xpToday, xpTodayDate } = applyDailyXp(
      { xp: profile.xp || 0, level: profile.level, xp_today: profile.xp_today || 0, xp_today_date: profile.xp_today_date },
      amount,
      today
    )
    const coins = profile.coins + coinsAwarded
    onProfileChange({ ...profile, xp, level, coins, xp_today: xpToday, xp_today_date: xpTodayDate })
    if (leveledUp) setLevelUpNotice({ level, coins: coinsAwarded })
    const { error } = await supabase.from('profiles')
      .update({ xp, level, coins, xp_today: xpToday, xp_today_date: xpTodayDate })
      .eq('id', profile.id)
    if (error) console.error(error)
  }

  async function spinWheel(coinsWon, chestWon) {
    const coins = profile.coins + coinsWon
    const chests = (profile.chests || 0) + (chestWon ? 1 : 0)
    const wheel_last_spin = todayISO()
    onProfileChange({ ...profile, coins, chests, wheel_last_spin })
    const { error } = await supabase.from('profiles')
      .update({ coins, chests, wheel_last_spin })
      .eq('id', profile.id)
    if (error) console.error(error)
  }

  async function earnChest() {
    const chests = (profile.chests || 0) + 1
    onProfileChange({ ...profile, chests })
    const { error } = await supabase.from('profiles').update({ chests }).eq('id', profile.id)
    if (error) console.error(error)
  }

  // Plafonnée (DAILY_COINS_CAP), même mécanisme que addCoins — un coffre ouvert reste toujours
  // possible même une fois le plafond atteint, seul le gain réel de pièces s'arrête.
  async function openChest(coinsWon) {
    const today = todayISO()
    const { coins, coinsToday, coinsTodayDate, gained, capped } = applyDailyCoins(
      { coins: profile.coins, coins_today: profile.coins_today || 0, coins_today_date: profile.coins_today_date },
      coinsWon,
      today
    )
    const chests = Math.max(0, (profile.chests || 0) - 1)
    onProfileChange({ ...profile, coins, chests, coins_today: coinsToday, coins_today_date: coinsTodayDate })
    const { error } = await supabase.from('profiles')
      .update({ coins, chests, coins_today: coinsToday, coins_today_date: coinsTodayDate })
      .eq('id', profile.id)
    if (error) console.error(error)
    return { gained, capped }
  }

  // Consomme la tentative du jour dès le lancement du Défi (pas à la fin) — sinon quitter en
  // cours de partie et recommencer permettrait de refarmer un bon score.
  async function startChallenge() {
    const challenge_last_play = todayISO()
    onProfileChange({ ...profile, challenge_last_play })
    const { error } = await supabase.from('profiles').update({ challenge_last_play }).eq('id', profile.id)
    if (error) console.error(error)
  }

  // Hors plafond de pièces : déjà borné à 1 fois/jour par startChallenge ci-dessus.
  async function playChallenge(coinsWon) {
    const coins = profile.coins + coinsWon
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
        onXpEarned={addXp}
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
        onXpEarned={addXp}
        onChestEarned={earnChest}
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
  if (view === 'wheel') {
    return (
      <DailyWheel
        lastSpin={profile.wheel_last_spin}
        onSpinResult={spinWheel}
        onExit={() => setView('home')}
      />
    )
  }
  if (view === 'chests') {
    return (
      <Chests
        count={profile.chests || 0}
        onOpen={openChest}
        onExit={() => setView('home')}
      />
    )
  }
  if (view === 'challenge') {
    return (
      <DailyChallenge
        language={language}
        variant={profile.variant}
        level={profile.level}
        alreadyPlayed={profile.challenge_last_play === todayISO()}
        onStart={startChallenge}
        onXpEarned={addXp}
        onFinish={playChallenge}
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
        <LevelProgress level={profile.level} xp={profile.xp || 0} />
        <p className="xp-today">
          ⚡ XP aujourd’hui : {Math.min(profile.xp_today_date === todayISO() ? (profile.xp_today || 0) : 0, DAILY_XP_CAP)}/{DAILY_XP_CAP}
        </p>
        <p className="xp-today">
          🪙 Pièces aujourd’hui : {Math.min(profile.coins_today_date === todayISO() ? (profile.coins_today || 0) : 0, DAILY_COINS_CAP)}/{DAILY_COINS_CAP}
        </p>
        {levelUpNotice && (
          <div className="level-up-banner">
            Niveau supérieur ! 🎉 Niveau {levelUpNotice.level} — +{levelUpNotice.coins} pièces
            <br />
            <button className="link" onClick={() => setLevelUpNotice(null)}>OK</button>
          </div>
        )}
        <p className="coins">🪙 {profile.coins}</p>
        <div className="menu">
          <button onClick={() => setView('flashcards')}>📇 Réviser mes flashcards</button>
          <button onClick={() => setView('quiz')}>🎮 Jouer au quiz</button>
          <button onClick={() => setView('slots')}>🎰 Machine à sous</button>
          <button onClick={() => setView('wheel')}>🎡 Roue quotidienne</button>
          <button onClick={() => setView('chests')}>🎁 Coffres ({profile.chests || 0})</button>
          <button onClick={() => setView('challenge')}>
            🏆 Défi du jour {profile.challenge_last_play === todayISO() ? '✓' : ''}
          </button>
          <button onClick={() => setView('shop')}>🛍️ Boutique</button>
        </div>
        <InstallButton />
        <button className="link" onClick={() => supabase.auth.signOut()}>Se déconnecter</button>
      </div>
    </div>
  )
}

const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent)

function InstallButton() {
  const [available, setAvailable] = useState(!!window.__habloInstallPrompt)
  const [iosHelp, setIosHelp] = useState(false)

  useEffect(() => {
    const onChange = () => setAvailable(!!window.__habloInstallPrompt)
    window.addEventListener('hablo:install-available', onChange)
    return () => window.removeEventListener('hablo:install-available', onChange)
  }, [])

  if (window.matchMedia('(display-mode: standalone)').matches) return null
  if (!available && !isIos) return null

  async function install() {
    if (isIos) {
      setIosHelp(true)
      return
    }
    const prompt = window.__habloInstallPrompt
    if (!prompt) return
    prompt.prompt()
    await prompt.userChoice
    window.__habloInstallPrompt = null
    setAvailable(false)
  }

  return (
    <>
      <button className="link" onClick={install}>📲 Installer l'app</button>
      {iosHelp && (
        <p className="muted center">Appuie sur le bouton Partager de Safari, puis « Sur l'écran d'accueil ».</p>
      )}
    </>
  )
}
