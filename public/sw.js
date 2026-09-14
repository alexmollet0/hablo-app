// Service worker minimal, uniquement pour satisfaire le critère d'installabilité de Chrome
// ("Installer l'application" n'apparaît que si un service worker avec un gestionnaire fetch est
// enregistré). PAS de cache, PAS de mode hors-ligne, intentionnel — voir le mécanisme anti-bundle
// périmé dans src/main.jsx (même pattern validé sur le projet frère Chefup) : un service worker
// qui mettrait en cache des réponses réintroduirait le risque d'un onglet bloqué sur un vieux
// bundle JS, en pire (un SW peut survivre plus longtemps qu'un onglet). Ce fichier ne doit JAMAIS
// appeler `event.respondWith(...)` avec une réponse mise en cache.
self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()))
self.addEventListener('fetch', () => {
  // Volontairement vide : la présence du listener suffit pour l'installabilité, sans jamais
  // intercepter ni mettre en cache une seule requête.
})
