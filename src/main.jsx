import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Détection de bundle périmé (même pattern validé sur Chefup) : un onglet laissé en arrière-plan
// (notamment mobile) peut continuer à exécuter une vieille version du JS pendant des jours sans
// refaire de vraie requête réseau (page restaurée depuis le bfcache). On détecte nous-mêmes la
// situation et on recharge automatiquement, sans action de l'utilisateur.
const currentScriptSrc = document.querySelector('script[type="module"]')?.src || ''
const checkForNewVersion = () => {
  if (document.visibilityState !== 'visible' || !currentScriptSrc) return
  fetch('/', { cache: 'no-store' })
    .then((res) => res.text())
    .then((html) => {
      const match = html.match(/<script[^>]*type="module"[^>]*src="([^"]+)"/i)
      const latestSrc = match ? new URL(match[1], window.location.origin).href : ''
      if (latestSrc && latestSrc !== currentScriptSrc) window.location.reload()
    })
    .catch(() => {})
}
document.addEventListener('visibilitychange', checkForNewVersion)
window.addEventListener('focus', checkForNewVersion)
window.addEventListener('pageshow', (event) => {
  if (event.persisted) checkForNewVersion()
})

// Service worker minimal, uniquement pour que Chrome propose "Installer l'application" — voir
// public/sw.js : il ne met RIEN en cache, exprès, pour ne jamais interférer avec la détection de
// nouveau déploiement ci-dessus.
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {})
  })
}

// Capture de l'invite d'installation Chrome/Edge, pour un vrai bouton "Installer l'app" dans
// App.jsx plutôt que de compter sur l'utilisateur pour trouver le menu du navigateur.
// ⚠️ N'existe pas sur iOS Safari — App.jsx affiche des instructions à la place dans ce cas.
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault()
  window.__habloInstallPrompt = e
  window.dispatchEvent(new Event('hablo:install-available'))
})
window.addEventListener('appinstalled', () => {
  window.__habloInstallPrompt = null
  window.dispatchEvent(new Event('hablo:install-available'))
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
