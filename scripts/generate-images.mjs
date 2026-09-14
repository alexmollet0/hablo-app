// Script ponctuel : génère les images de la boutique (looks, maisons, animaux) via l'API OpenAI
// (gpt-image-1). Exécuté une seule fois en local (jamais au runtime de l'app) :
// `node scripts/generate-images.mjs`. Nécessite OPENAI_API_KEY dans .env.local.
// Ignore les images déjà générées (relancer pour ajouter/compléter un ensemble).
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

function loadEnvLocal() {
  const content = readFileSync(join(root, '.env.local'), 'utf-8')
  for (const line of content.split('\n')) {
    const match = line.match(/^([A-Z_]+)=(.*)$/)
    if (match) process.env[match[1]] = match[2].trim()
  }
}
loadEnvLocal()

const API_KEY = process.env.OPENAI_API_KEY
if (!API_KEY) {
  console.error('OPENAI_API_KEY manquant dans .env.local')
  process.exit(1)
}

// Note : éviter le blanc pur (#fff) dans les descriptions — avec un fond transparent, ce
// générateur traite parfois les zones blanches plates comme de l'arrière-plan et les rend
// transparentes elles aussi (bug constaté sur plusieurs looks). Préférer "light grey"/"cream"/
// "off-white" pour toute zone claire du sujet.
const CHARACTER_STYLE_PREFIX =
  'Full-body illustrated character, standing pose facing forward, flat vector illustration ' +
  'style with bold clean black outlines and vibrant flat colors, digital illustration, ' +
  'centered composition, transparent background, no shadows on ground, no scenery or props ' +
  'around the character, single character only, avoid pure flat white fills anywhere on the ' +
  'character (use light grey or cream instead) since pure white can be mistaken for the ' +
  'transparent background. Character: '

const PET_STYLE_PREFIX =
  'A single cute pet animal illustration, flat vector illustration style with bold clean black ' +
  'outlines and vibrant flat colors, digital illustration, sitting or standing pose, centered ' +
  'composition, transparent background, no shadows, no scenery around it, avoid pure flat white ' +
  'fills (use light grey or cream instead) since pure white can be mistaken for the transparent ' +
  'background. Animal: '

const HOUSE_STYLE_PREFIX =
  'A full illustrated scene of a dwelling exterior or interior, flat vector illustration style ' +
  'with bold clean outlines and vibrant flat colors, digital illustration, portrait ' +
  'orientation, warm inviting lighting, no characters or people visible. Scene: '

const ICON_STYLE_PREFIX =
  'App icon illustration, flat vector style with bold clean black outlines, square composition, ' +
  'centered subject filling most of the frame, solid warm orange background (#ff6b4a), simple ' +
  'and bold enough to read at a small size, no text anywhere. Subject: '

const SETS = [
  {
    dir: 'looks',
    stylePrefix: CHARACTER_STYLE_PREFIX,
    background: 'transparent',
    items: [
      { id: 'look_base', prompt: 'wearing simple neutral casual clothes, plain light blue t-shirt (not white) and blue jeans, no accessories, relaxed friendly pose' },
      { id: 'look_streetwear', prompt: 'wearing urban streetwear: oversized black hoodie, baggy cargo pants, light grey sneakers (not white), cap worn backwards, gold chain necklace' },
      { id: 'look_sportif', prompt: 'wearing athletic sportswear: red running tank top, black shorts, sports shoes, headband, holding a basketball' },
      { id: 'look_aventurier', prompt: 'wearing an adventurer explorer outfit: khaki vest with many pockets, cargo pants, brown hiking boots, wide-brim hat, small backpack' },
      { id: 'look_elegant', prompt: 'wearing an elegant evening formal outfit: sleek black suit, bow tie, pale cream dress shirt (not white), polished black dress shoes, sophisticated confident pose' },
      { id: 'look_rockstar', prompt: 'wearing a rockstar outfit: black leather jacket, ripped skinny jeans, studded boots, sunglasses, spiky hair, electric guitar slung on the back' },
      { id: 'look_cyberpunk', prompt: 'wearing a cyberpunk neon outfit: futuristic jacket with glowing neon blue and pink accents, tech visor glasses, dark techwear pants' },
      { id: 'look_spatial', prompt: 'wearing a futuristic space explorer outfit: sleek light grey and silver spacesuit (not white) with glowing blue accents, astronaut helmet held under one arm' },
      { id: 'look_royal', prompt: 'wearing a royal luxurious outfit: ornate red and gold velvet robe, golden crown, regal confident pose' },
      { id: 'look_legendaire', prompt: 'wearing a legendary golden outfit: full shimmering gold armor with intricate engravings, majestic flowing cape, radiating a soft golden glow' },
    ],
  },
  {
    dir: 'houses',
    stylePrefix: HOUSE_STYLE_PREFIX,
    background: 'opaque',
    items: [
      { id: 'house_rue', prompt: 'a plain modest city street at dusk, one simple lamppost, cracked sidewalk, a run-down building entrance in the background, humble and bare atmosphere' },
      { id: 'house_chambre', prompt: 'a small cozy rented bedroom, a simple bed, one window with soft afternoon light, modest secondhand furniture, warm but humble' },
      { id: 'house_studio', prompt: 'a small tidy modern studio apartment interior, compact kitchenette, single bed, one big window, clean minimalist middle-class comfort' },
      { id: 'house_appartement', prompt: 'a bright spacious modern apartment interior, stylish furniture, large windows overlooking a city skyline, comfortable upper-middle-class living room' },
      { id: 'house_villa', prompt: 'a beautiful suburban villa exterior with a lush green garden, swimming pool, large glass windows, warm golden sunset light, clearly wealthy and inviting' },
      { id: 'house_chateau', prompt: 'a grand majestic castle exterior with tall towers, waving flags, ornate golden architecture, fountains and manicured gardens, golden hour lighting, opulent and awe-inspiring' },
    ],
  },
  {
    dir: 'pets',
    stylePrefix: PET_STYLE_PREFIX,
    background: 'transparent',
    items: [
      { id: 'pet_dog', prompt: 'a happy golden retriever puppy sitting, wagging tail' },
      { id: 'pet_cat', prompt: 'a cute sitting cat with big eyes, tail curled around its paws' },
      { id: 'pet_rabbit', prompt: 'a fluffy white rabbit sitting, long ears up' },
      { id: 'pet_parrot', prompt: 'a colorful tropical parrot perched, vivid red green and blue feathers' },
      { id: 'pet_dragon', prompt: 'a small cute legendary baby dragon with shimmering gold scales, tiny wings spread, glowing softly' },
    ],
  },
  {
    dir: 'icons',
    stylePrefix: ICON_STYLE_PREFIX,
    background: 'opaque',
    size: '1024x1024',
    items: [
      { id: 'icon-source', prompt: 'a friendly cartoon parrot wearing small round glasses, mid-speech with an open speech bubble shape (no text inside it), playful and welcoming' },
    ],
  },
]

async function generateImage(dir, stylePrefix, background, size, { id, prompt }) {
  const outDir = join(root, 'public', dir)
  mkdirSync(outDir, { recursive: true })
  const outPath = join(outDir, `${id}.png`)
  if (existsSync(outPath) || existsSync(outPath.replace(/\.png$/, '.webp'))) {
    console.log(`↷ ${dir}/${id} déjà généré, ignoré`)
    return
  }
  console.log(`… génération ${dir}/${id}`)
  const res = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-image-1',
      prompt: stylePrefix + prompt,
      size,
      quality: 'high',
      background,
      n: 1,
    }),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`${dir}/${id}: HTTP ${res.status} — ${text}`)
  }
  const json = await res.json()
  const b64 = json.data?.[0]?.b64_json
  if (!b64) throw new Error(`${dir}/${id}: pas de b64_json dans la réponse — ${JSON.stringify(json).slice(0, 300)}`)
  writeFileSync(outPath, Buffer.from(b64, 'base64'))
  console.log(`✓ ${dir}/${id} → public/${dir}/${id}.png`)
}

for (const set of SETS) {
  for (const item of set.items) {
    await generateImage(set.dir, set.stylePrefix, set.background, set.size || '1024x1536', item)
  }
}
console.log('Terminé.')
