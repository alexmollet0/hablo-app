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
**Déployé en production** : [github.com/alexmollet0/hablo-app](https://github.com/alexmollet0/hablo-app)
→ [hablo-app.vercel.app](https://hablo-app.vercel.app), redéploiement auto à chaque push comme
Chefup. Variables d'environnement Vercel (`VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY`) déjà
renseignées.

Boucle complète testée EN VRAI (pas de contournement, y compris en production) : inscription
réelle, choix de langue (espagnol variante Espagne/LatAm OU anglais sans variante), test de
niveau, flashcards, quiz, machine à sous, **boutique** (looks IA + maisons illustrées, voir
"Looks + maisons" ci-dessous) — persistance en base vérifiée après rechargement complet à chaque
étape.

**Piège rencontré et corrigé (x2 ce jour, même cause)** : après avoir ajouté des colonnes au
schéma (`target_language`/`coins` d'abord, puis `owned_items`/`equipped` pour la boutique), la
migration avait été faite dans le fichier local `supabase/schema.sql` mais pas sur le vrai projet
Supabase déjà créé — l'app avait l'air de marcher (état local React) mais rien ne persistait
(écritures en erreur silencieuse `PGRST204 column not found`). **Retenir fermement pour toute
future migration** : exécuter le SQL sur le vrai projet Supabase (SQL Editor) EN PLUS du fichier
`schema.sql`, jamais l'un sans l'autre — toujours vérifier par un rechargement complet après une
migration, pas seulement l'état affiché juste après l'action.

**Premier retour utilisateur réel (2026-09-14)** : contenu pédagogique jugé trop facile (attendu,
vocabulaire placeholder) ; pièces gagnées à la machine à sous ne servaient à rien → boutique
ajoutée le jour même. **Deuxième et troisième retour le même jour** : deux itérations sur
l'avatar (emoji jugé pas beau → DiceBear en couches jugé toujours pas assez beau/pas assez
"manga" et maisons "juste des couleurs") → version finale : looks IA + illustrations de maison
dessinées (voir "Looks + maisons" ci-dessous et "Fichiers clés"). **Retour encore à traiter, pas
urgent** : élargir le contenu pédagogique (vocabulaire + questions) pour que ce soit un vrai
challenge, priorité fixée par l'utilisateur APRÈS la boutique/l'avatar (déjà faits).

**Looks + maisons (version finale, 2026-09-14)** : après une tentative DiceBear jugée pas assez
belle (abandonnée), passage à des **looks complets générés par IA** (OpenAI `gpt-image-1`, prompt
commun "illustration vectorielle plate" + description de tenue qui varie, fond transparent,
1024×1536) — achetés comme des **skins de jeu entiers**, pas des pièces à combiner (une pièce de
vêtement générée séparément par IA ne s'alignerait pas sur le personnage — limite technique
assumée avec l'utilisateur). 10 looks générés une fois via `scripts/generate-looks.mjs`
(nécessite `OPENAI_API_KEY` dans `.env.local`, jamais commitée, jamais utilisée au runtime),
images compressées en WebP après coup (~2 Mo → ~90 Ko chacune, `sharp` en devDependency) et
servies en statique depuis `public/looks/`. **Maisons** : illustrations SVG dessinées à la main
(6 paliers, `HouseIllustration.jsx`) plutôt que des dégradés de couleur — restent l'objet le plus
cher du jeu (jusqu'à 50 000 pièces pour le château), en vrai arrière-plan derrière le personnage.
Catalogue boutique réduit à 2 catégories (`look`/`maison`) — pas de migration Supabase (mêmes
colonnes génériques `owned_items`/`equipped`), les objets des anciens systèmes (emoji, DiceBear)
deviennent orphelins sans casser l'app. **Coût réel** : quelques euros pour les 10 looks de
départ, même tarif à l'unité pour en ajouter plus tard. Idée notée pour plus tard, pas commencée :
animaux de compagnie achetables (plus simple qu'un vêtement, pas de problème d'alignement).

**Pas encore fait** : Stripe. Compte de test à nettoyer plus tard dans Supabase
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
- `src/content/shopItems.js` — catalogue boutique, 2 catégories : `look` (image statique `image: '/looks/xxx.webp'`) et `maison` (juste métadonnées, illustration dans `HouseIllustration.jsx`). `defaultItem`/`getEquipped` (repli sur l'objet gratuit si rien d'équipé). Prix des looks calibrés pour être moins chers que les maisons (la richesse se montre par le logement).
- `src/HouseIllustration.jsx` — 6 illustrations SVG dessinées à la main (une par palier de maison), pas de génération IA (pas de problème d'alignement pour un simple arrière-plan).
- `scripts/generate-looks.mjs` — script ponctuel (jamais exécuté en prod) qui appelle l'API OpenAI (`gpt-image-1`) pour générer les images de `public/looks/`. Relancer seulement pour ajouter/regénérer un look.
- `src/Shop.jsx` — 2 onglets (Looks/Maison), aperçu réel par objet (image du look, ou illustration de la maison), achat (déduit les pièces + équipe direct) ou équipement d'un objet déjà possédé.
- `src/AvatarDisplay.jsx` — `AvatarDisplay` (illustration de maison en arrière-plan + image du look équipé par-dessus, utilisé dans l'en-tête de `MainApp`) et `LookImage` (juste l'image du look, réutilisé pour les aperçus boutique).
- `src/App.jsx` — `MainApp` : affiche avatar/niveau/langue/variante/solde de pièces, menu (flashcards/quiz/machine à sous/boutique), `addCoins`/`buyItem`/`equipItem` mettent à jour l'état local ET écrivent dans Supabase.
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
