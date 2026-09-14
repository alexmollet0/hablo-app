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

**Looks + maisons + animaux (version finale, 2026-09-14)** : après une tentative DiceBear jugée
pas assez belle (abandonnée), tout est généré par IA (OpenAI `gpt-image-1`) via
`scripts/generate-images.mjs` (nécessite `OPENAI_API_KEY` dans `.env.local`, jamais commitée,
jamais utilisée au runtime — images statiques une fois générées), compressé en WebP après coup
(~2 Mo → ~60-175 Ko chacune, `sharp` en devDependency), servi depuis `public/{looks,houses,pets}/`.
- **Looks** (fond transparent) : achetés comme des **skins de jeu entiers**, pas des pièces à
  combiner (une pièce de vêtement générée séparément par IA ne s'alignerait pas sur le personnage
  — limite technique assumée avec l'utilisateur). 10 au catalogue.
- **Maisons** (fond opaque, scène complète — d'abord tentées en SVG dessiné à la main, jugé "trop
  simple", puis regénérées par IA comme les looks) : restent l'objet le plus cher du jeu (jusqu'à
  50 000 pièces pour le château), en vrai arrière-plan derrière le personnage (`object-fit: cover`
  plein cadre). 6 paliers.
- **Animaux de compagnie** (fond transparent, nouvelle catégorie) : affichés à côté du personnage
  (coin inférieur droit), jamais superposés — demande explicite de l'utilisateur. 5 au catalogue,
  dragon légendaire compris.

**⚠️ Bug réel trouvé et corrigé** : le mode "fond transparent" de l'API rend aussi transparentes
les zones **blanc pur** du sujet lui-même (pas seulement l'arrière-plan) — 4 looks sur 10 (dont le
look gratuit de départ, vu par tout nouveau compte) avaient des vêtements entiers invisibles une
fois composés sur un fond coloré, alors que le fichier seul semblait correct sur fond blanc du
Read tool. **Piège à retenir** : toujours vérifier une image à fond "transparent" en l'ouvrant
SEULE sur fond sombre (`navigate` vers son URL directe), jamais seulement composée dans l'app ou
prévisualisée sur fond blanc. Corrigé en remplaçant le blanc pur par du gris clair/crème dans les
prompts (`CHARACTER_STYLE_PREFIX`/`PET_STYLE_PREFIX` dans `generate-images.mjs` avertissent
maintenant explicitement contre le blanc pur pour toute future génération).

Catalogue boutique : 3 catégories (`look`/`maison`/`pet`) — pas de migration Supabase (mêmes
colonnes génériques `owned_items`/`equipped`), les objets des anciens systèmes (emoji, DiceBear)
deviennent orphelins sans casser l'app. **Coût réel total (looks + maisons + animaux + une
regénération de 4 looks)** : quelques euros.

**Ordre de priorité fixé par l'utilisateur** : (1) plus de looks (pas urgent) (2) ✅ maisons +
animaux (3) ✅ contenu pédagogique + système de niveaux (4) plus de jeux pour gagner des pièces
(au-delà de la machine à sous) — **seul point (4) pas commencé**.

**Système de niveaux XP (2026-09-14)** : `profile.level` était figé une fois pour toutes par le
test de placement — transformé en vraie progression continue. Le test de placement fixe
maintenant un **point de départ**, plus un plafond : flashcard correcte +5 XP (+1 ratée),
bonne réponse au quiz +8 XP (pas la machine à sous, qui reste centrée pièces), seuil
`100 + (niveau-1)×50` XP par palier, récompense `50×nouveau niveau` pièces à chaque niveau
franchi. Logique dans `src/content/level.js` (`xpToNextLevel`/`applyXp`). Écrans : badge
"Nv. X" superposé sur l'avatar (`AvatarDisplay.jsx`, visible d'un coup d'œil — prépare le
multijoueur), frise de progression illustrée 9 pastilles + barre XP (`LevelProgress.jsx`),
bandeau de félicitations au level-up (état local `levelUpNotice` dans `MainApp`). Nouvelle
colonne `xp` sur `profiles` — **migration à exécuter sur le vrai projet Supabase avant de
tester** (`alter table profiles add column if not exists xp int not null default 0;`).

**Contenu élargi (2026-09-14)** : vocabulaire par langue passé de 48 à **129 mots** (~14-15 par
niveau au lieu de 5-6), vérifié programmatiquement (ids uniques, `level`/`topic`/`fr` alignés
entre `vocabEs.js`/`vocabEn.js` pour chaque concept — script de vérif non conservé, à refaire si
le contenu est encore élargi). Tests de placement relus, jugés déjà clairs, non modifiés.

**Pas encore fait** : Stripe, plus de jeux pour gagner des pièces. Compte de test à nettoyer plus
tard dans Supabase (Authentication > Users) : `hablo.realtest.sept@gmail.com`.

## Fichiers clés
- `src/supabaseClient.js` — client Supabase, `isSupabaseConfigured` (false si `.env.local` vide → écran "Configuration manquante" au lieu de planter).
- `src/Auth.jsx` — `AuthGate` : mot de passe ou code à 6 chiffres par email. Pas de Google OAuth pour l'instant.
- `src/content/language.js` — registre central des langues (`{ es: {...}, en: {...} }`, vocabulaire + questions de test + `hasVariant`) + `getWord(card, lang, variant)`. Point d'entrée à utiliser partout plutôt que d'importer un contenu de langue directement.
- `src/content/vocabEs.js` / `vocabEn.js` — vocabulaire par langue (129 mots chacun, ~14-15 par niveau, mêmes `id`/`level`/`topic`/`fr` en parallèle). Espagnol a des vraies différences Espagne/LatAm (coche/carro, ordenador/computadora, móvil/celular, zumo/jugo, patata/papa, billete/boleto) ; anglais n'a pas de distinction UK/US pour l'instant.
- `src/content/placementTestEs.js` / `placementTestEn.js` — 15 questions par langue, mêmes poids 1-9. `src/content/level.js` — `scorePlacementTest`/`levelTier` (test de placement) + `xpToNextLevel`/`applyXp`/`MAX_LEVEL` (système de niveaux XP), logique partagée indépendante de la langue.
- `src/content/quizRounds.js` — construction de questions à choix multiple (mélange + distracteurs), factorisé et réutilisé par `QuizGame` et `SlotMachineGame`.
- `src/leitner.js` — répétition espacée simplifiée (4 boîtes, intervalles 0/1/3/7 jours), volontairement plus simple qu'un SM-2 complet.
- `src/Onboarding.jsx` + `src/PlacementTest.jsx` — étapes : choix de la langue → (variante si espagnol) → test de niveau → résultat. Écrit `target_language`/`variant`/`level`/`xp`/`onboarded` dans `profiles`.
- `src/Flashcards.jsx` — file de révision (langue-aware via `language`/`variant` props), `onXpEarned` sur chaque réponse.
- `src/games/QuizGame.jsx` — QCM classique, 10 questions, `onXpEarned` sur bonne réponse.
- `src/LevelProgress.jsx` — frise de progression illustrée (9 paliers + barre XP), affichée sous l'avatar sur l'accueil.
- `src/games/SlotMachineGame.jsx` — machine à sous : bonne réponse → tirage pondéré d'un palier (🍒 Commun 60%/+5, 🔔 Rare 25%/+15, 💎 Épique 12%/+40, 👑 Légendaire 3%/+100) → animation de rouleaux (CSS) → pièces ajoutées à `profiles.coins`. **Simplification volontaire documentée dans le code** : le tirage se fait avant l'animation, les 3 rouleaux affichent le même symbole (pas de vraie logique de correspondance indépendante par rouleau).
- `src/content/shopItems.js` — catalogue boutique, 3 catégories (`look`/`maison`/`pet`), chaque objet porte `image: '/xxx/yyy.webp'` (ou `null` pour "Aucun animal"). `defaultItem`/`getEquipped` (repli sur l'objet gratuit si rien d'équipé). Prix des looks/animaux calibrés pour être moins chers que les maisons (la richesse se montre par le logement).
- `scripts/generate-images.mjs` — script ponctuel (jamais exécuté en prod) qui appelle l'API OpenAI (`gpt-image-1`) pour générer les 3 ensembles d'images (`SETS` : looks fond transparent, maisons fond opaque, animaux fond transparent). Ignore les fichiers déjà générés (relancer pour ajouter/compléter, supprimer un fichier précis pour le regénérer).
- `src/Shop.jsx` — 3 onglets (Looks/Maison/Animaux), aperçu réel par objet, achat (déduit les pièces + équipe direct) ou équipement d'un objet déjà possédé.
- `src/AvatarDisplay.jsx` — `AvatarDisplay` (image de maison plein cadre en arrière-plan + look équipé par-dessus + animal en overlay coin inférieur droit, utilisé dans l'en-tête de `MainApp`) et `LookImage` (juste l'image, réutilisé pour les aperçus boutique).
- `src/App.jsx` — `MainApp` : affiche avatar/niveau/langue/variante/solde de pièces/progression XP, menu (flashcards/quiz/machine à sous/boutique), `addCoins`/`addXp`/`buyItem`/`equipItem` mettent à jour l'état local ET écrivent dans Supabase.
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
