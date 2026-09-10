# Hablo (nom de travail) — contexte du projet

App pour apprendre l'espagnol, à la fois pour l'usage personnel de l'utilisateur (installation
en Espagne en cours) et pour la revente (accès à 2-3€/personne). Différenciateur vs Duolingo :
**multijoueur en direct entre amis**, en plus d'un vrai test de niveau à l'entrée et d'un
système de niveaux. React + Vite, pensé pour Vercel + Supabase + Stripe (même pattern que le
projet frère `marge-cuisine`/Chefup, dans `Documents/`). Nom de dossier/dépôt actuel :
`hablo-app` (placeholder, pas encore de marque choisie).

**Environnement** : Node 24 dispo, `gh`/`vercel` CLI absents — dépôt GitHub et projet Vercel
à créer via leurs interfaces web (par l'utilisateur, non-développeur).

## État actuel (2026-09-10)
Scaffold + boucle pédagogique solo posés et vérifiés dans le navigateur (contournement d'auth
temporaire, jamais commité). **Pas encore de vrai projet Supabase/Stripe/Vercel/GitHub** — rien
n'a donc pu être testé avec un vrai backend (auth réelle, écriture en base, paiement). Prochaine
session : créer ces projets (voir "À faire avant de pouvoir tester en vrai" ci-dessous), puis
continuer le plan (jeux solo additionnels → multijoueur → paiement → contenu élargi).

## Fichiers clés
- `src/supabaseClient.js` — client Supabase, `isSupabaseConfigured` (false si `.env.local` vide → écran "Configuration manquante" au lieu de planter, `createClient` exige une URL valide sinon crash immédiat).
- `src/Auth.jsx` — `AuthGate` : mot de passe ou code à 6 chiffres par email. Pas de Google OAuth pour l'instant (à ajouter si besoin).
- `src/Onboarding.jsx` + `src/PlacementTest.jsx` — choix de la variante (Espagne/Amérique Latine) puis test de niveau (15 questions, poids 1-9, `src/content/placementTest.js`), écrit le profil (`variant`, `level`, `onboarded`) dans Supabase.
- `src/content/vocab.js` — vocabulaire de départ (48 mots, niveaux 1-9, quelques vraies différences Espagne/LatAm : coche/carro, ordenador/computadora, móvil/celular, zumo/jugo, patata/papa, billete/boleto). **À élargir largement** (v1 = preuve de mécanisme, pas un vrai contenu de lancement).
- `src/leitner.js` — répétition espacée simplifiée (4 boîtes, intervalles 0/1/3/7 jours), volontairement plus simple qu'un SM-2 complet.
- `src/Flashcards.jsx` — file de révision (cartes dues chargées/écrites via la table `card_progress`).
- `src/games/QuizGame.jsx` — premier jeu solo (QCM, 10 questions, mot espagnol à retrouver depuis la traduction FR).
- `src/App.jsx` — orchestrateur : `AuthGate` → profil non onboardé → `Onboarding` → sinon `MainApp` (menu flashcards/quiz).
- `supabase/schema.sql` — schéma à exécuter dans l'éditeur SQL Supabase (`profiles`, `card_progress`, RLS par `user_id`/`id`). **Pas encore exécuté sur un vrai projet.**
- `.env.example` — variables nécessaires (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).
- `.claude/launch.json` — config du serveur de dev pour l'aperçu navigateur.

## À faire avant de pouvoir tester en vrai (bloque la suite)
1. **Créer un projet Supabase** (dashboard web) → copier `Project URL`/`anon public key` dans `.env.local` (créer le fichier depuis `.env.example`) → exécuter `supabase/schema.sql` dans l'éditeur SQL.
2. **Créer un dépôt GitHub** (`gh` absent) → `git remote add origin ...` → push.
3. **Créer un projet Vercel** lié à ce dépôt (déploiement auto à chaque push comme Chefup).
4. **Stripe** : pas encore nécessaire tant que l'étape paiement (voir plan) n'est pas commencée.

## Modèle pédagogique
- Test de niveau à l'inscription → place sur un niveau 1-9, regroupé en 3 paliers affichés (Facile 1-3 / Intermédiaire 4-6 / Difficile 7-9).
- Répétition espacée façon Leitner (pas SM-2, volontairement plus simple pour un V1).
- Contenu pré-écrit (pas généré à la volée par IA en prod), organisé par niveau × thème × variante.

## Multijoueur (pas encore commencé)
Prévu via Supabase Realtime (broadcast/presence par `match_id`, premier joueur = hôte qui fait
avancer les questions) — pas de serveur WebSocket dédié. Voir le plan de session pour le détail
(duel : lien/code d'invitation, mêmes questions, timer, scores en direct, écran de résultat).

## Paiement (pas encore commencé)
Stripe Checkout **paiement unique** (pas d'abonnement) pour un accès complet — plus simple que
le système essai/abonnement de Chefup vu le prix très bas (2-3€). Aperçu gratuit prévu : test de
niveau + premier niveau, reste verrouillé.

## Notes
- L'utilisateur n'est pas développeur — mêmes réflexes que sur Chefup : expliquer avant de coder pour les décisions non triviales, `npm run build` après tout changement structurant, ne jamais deviner un correctif sans preuve.
- Contournement d'authentification temporaire utilisé pour vérifier l'UI sans backend réel (bascule directe sur `Onboarding`/`MainApp` dans `App.jsx`) — jamais commité, à refaire au besoin en session.
