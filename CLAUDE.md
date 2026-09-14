# Hablo (nom de travail) — contexte du projet

App pour apprendre l'espagnol ET l'anglais, à la fois pour l'usage personnel de l'utilisateur
(installation en Espagne en cours) et pour la revente (accès à 2-3€/personne). Différenciateurs
vs Duolingo : **multijoueur en direct entre amis** (pas encore commencé) et une **mécanique
"casino" à pièces virtuelles** (jamais convertibles en argent réel — contrainte explicite),
en plus d'un vrai test de niveau à l'entrée et d'un système de niveaux. React + Vite (décision
explicite de l'utilisateur de garder Vite plutôt que migrer sur Next.js malgré un brief externe
qui le suggérait), pensé pour Vercel + Supabase + Stripe (même pattern que le projet frère
`marge-cuisine`/Chefup, dans `Documents/`). Nom de dossier/dépôt actuel : `hablo-app`
(placeholder, pas encore de marque choisie).

**Environnement** : Node 24 dispo, `gh`/`vercel` CLI absents — dépôt GitHub et projet Vercel
à créer via leurs interfaces web (par l'utilisateur, non-développeur).

## État actuel (2026-09-14)
Projet Supabase réel créé et connecté (organisation "Hablo", séparée de celle de Chefup).
Boucle complète testée EN VRAI (pas de contournement) : inscription réelle, choix de langue
(espagnol variante Espagne/LatAm OU anglais sans variante), test de niveau, flashcards, quiz,
machine à sous — persistance en base vérifiée après rechargement complet (`target_language`,
`variant`, `level`, `coins`). **Piège rencontré et corrigé** : après avoir ajouté des colonnes
au schéma, la migration avait été faite dans le fichier local `supabase/schema.sql` mais pas
sur le vrai projet Supabase déjà créé — l'app avait l'air de marcher (état local React) mais
rien ne persistait (écritures en erreur silencieuse `PGRST204 column not found`). Retenir : sur
ce projet, une migration de schéma doit être exécutée sur le vrai projet Supabase (SQL Editor)
en plus du fichier `schema.sql`, jamais l'un sans l'autre — toujours vérifier par un rechargement
complet après une migration, pas seulement l'état affiché.

**Pas encore fait** : GitHub, Vercel, Stripe. Compte de test à nettoyer plus tard dans Supabase
(Authentication > Users) : `hablo.realtest.sept@gmail.com`.

## Fichiers clés
- `src/supabaseClient.js` — client Supabase, `isSupabaseConfigured` (false si `.env.local` vide → écran "Configuration manquante" au lieu de planter).
- `src/Auth.jsx` — `AuthGate` : mot de passe ou code à 6 chiffres par email. Pas de Google OAuth pour l'instant.
- `src/content/language.js` — registre central des langues (`{ es: {...}, en: {...} }`, vocabulaire + questions de test + `hasVariant`) + `getWord(card, lang, variant)`. Point d'entrée à utiliser partout plutôt que d'importer un contenu de langue directement.
- `src/content/vocabEs.js` / `vocabEn.js` — vocabulaire par langue (48 mots chacun, mêmes `id`/`level`/`topic`/`fr` en parallèle). Espagnol a des vraies différences Espagne/LatAm (coche/carro, ordenador/computadora, móvil/celular, zumo/jugo, patata/papa, billete/boleto) ; anglais n'a pas de distinction UK/US pour l'instant. **Contenu volontairement limité (v1 = preuve de mécanisme), à élargir largement avant un vrai lancement.**
- `src/content/placementTestEs.js` / `placementTestEn.js` — 15 questions par langue, mêmes poids 1-9. `src/content/level.js` — `scorePlacementTest`/`levelTier`, logique partagée indépendante de la langue.
- `src/content/quizRounds.js` — construction de questions à choix multiple (mélange + distracteurs), factorisé et réutilisé par `QuizGame` et `SlotMachineGame`.
- `src/leitner.js` — répétition espacée simplifiée (4 boîtes, intervalles 0/1/3/7 jours), volontairement plus simple qu'un SM-2 complet.
- `src/Onboarding.jsx` + `src/PlacementTest.jsx` — étapes : choix de la langue → (variante si espagnol) → test de niveau → résultat. Écrit `target_language`/`variant`/`level`/`onboarded` dans `profiles`.
- `src/Flashcards.jsx` — file de révision (langue-aware via `language`/`variant` props).
- `src/games/QuizGame.jsx` — QCM classique, 10 questions.
- `src/games/SlotMachineGame.jsx` — machine à sous : bonne réponse → tirage pondéré d'un palier (🍒 Commun 60%/+5, 🔔 Rare 25%/+15, 💎 Épique 12%/+40, 👑 Légendaire 3%/+100) → animation de rouleaux (CSS) → pièces ajoutées à `profiles.coins`. **Simplification volontaire documentée dans le code** : le tirage se fait avant l'animation, les 3 rouleaux affichent le même symbole (pas de vraie logique de correspondance indépendante par rouleau).
- `src/App.jsx` — `MainApp` : affiche niveau/langue/variante/solde de pièces, menu (flashcards/quiz/machine à sous), `addCoins` met à jour l'état local ET écrit dans Supabase.
- `supabase/schema.sql` — schéma à jour (source de vérité pour un nouveau projet). Le projet réel a été migré à la main via le SQL Editor (voir "État actuel").
- `.env.example` — variables nécessaires (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).
- `.claude/launch.json` — config du serveur de dev pour l'aperçu navigateur.

## Modèle pédagogique
- Choix de la langue (espagnol ou anglais) à l'inscription, variante Espagne/LatAm seulement pour l'espagnol.
- Test de niveau à l'inscription → place sur un niveau 1-9, regroupé en 3 paliers affichés (Facile 1-3 / Intermédiaire 4-6 / Difficile 7-9).
- Répétition espacée façon Leitner (pas SM-2, volontairement plus simple pour un V1).
- Contenu pré-écrit (pas généré à la volée par IA en prod), organisé par niveau × thème × langue.

## Multijoueur (pas encore commencé)
Prévu via Supabase Realtime (broadcast/presence par `match_id`, premier joueur = hôte qui fait
avancer les questions) — pas de serveur WebSocket dédié. Voir l'historique des plans de session
pour le détail (duel : lien/code d'invitation, mêmes questions, timer, scores en direct, écran
de résultat).

## Paiement (pas encore commencé)
Stripe Checkout **paiement unique** (pas d'abonnement) pour un accès complet — plus simple que
le système essai/abonnement de Chefup vu le prix très bas (2-3€). Aperçu gratuit prévu : test de
niveau + premier niveau, reste verrouillé.

## Notes
- L'utilisateur n'est pas développeur — mêmes réflexes que sur Chefup : expliquer avant de coder pour les décisions non triviales, `npm run build` après tout changement structurant, ne jamais deviner un correctif sans preuve, **toujours vérifier une migration de schéma par un test réel de bout en bout (rechargement complet), pas par l'état affiché juste après l'action**.
- Contournement d'authentification temporaire utilisé pour vérifier l'UI sans backend réel (bascule directe sur `Onboarding`/`MainApp` dans `App.jsx`) — jamais commité, à refaire au besoin en session.
- Un brief externe (`brief-projet-claude-code.md`, fourni par l'utilisateur le 2026-09-14) proposait Next.js/Tailwind et une mécanique "machine à sous" comme UNIQUE jeu de départ — arbitrage fait avec l'utilisateur : on garde Vite (déjà construit/testé) et on garde le test de niveau/flashcards/quiz existants, la machine à sous vient EN PLUS. Langues : anglais ajouté dès cette session (demande explicite), pas repoussé à plus tard.
