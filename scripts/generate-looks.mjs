// Script ponctuel : génère les images de looks de la boutique via l'API OpenAI (gpt-image-1).
// Exécuté une seule fois en local (jamais au runtime de l'app) : `node scripts/generate-looks.mjs`
// Nécessite OPENAI_API_KEY dans .env.local. Sauvegarde chaque image dans public/looks/<id>.png.
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

function loadEnvLocal() {
  const envPath = join(root, '.env.local')
  const content = readFileSync(envPath, 'utf-8')
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

const STYLE_PREFIX =
  'Full-body illustrated character, standing pose facing forward, flat vector illustration ' +
  'style with bold clean black outlines and vibrant flat colors, digital illustration, ' +
  'centered composition, transparent background, no shadows on ground, no scenery or props ' +
  'around the character, single character only. Character: '

const LOOKS = [
  { id: 'look_base', prompt: 'wearing simple neutral casual clothes, plain white t-shirt and blue jeans, no accessories, relaxed friendly pose' },
  { id: 'look_streetwear', prompt: 'wearing urban streetwear: oversized black hoodie, baggy cargo pants, white sneakers, cap worn backwards, gold chain necklace' },
  { id: 'look_sportif', prompt: 'wearing athletic sportswear: red running tank top, black shorts, sports shoes, headband, holding a basketball' },
  { id: 'look_aventurier', prompt: 'wearing an adventurer explorer outfit: khaki vest with many pockets, cargo pants, brown hiking boots, wide-brim hat, small backpack' },
  { id: 'look_elegant', prompt: 'wearing an elegant evening formal outfit: sleek black suit, bow tie, polished black dress shoes, sophisticated confident pose' },
  { id: 'look_rockstar', prompt: 'wearing a rockstar outfit: black leather jacket, ripped skinny jeans, studded boots, sunglasses, spiky hair, electric guitar slung on the back' },
  { id: 'look_cyberpunk', prompt: 'wearing a cyberpunk neon outfit: futuristic jacket with glowing neon blue and pink accents, tech visor glasses, dark techwear pants' },
  { id: 'look_spatial', prompt: 'wearing a futuristic space explorer outfit: sleek white and silver spacesuit with glowing blue accents, astronaut helmet held under one arm' },
  { id: 'look_royal', prompt: 'wearing a royal luxurious outfit: ornate red and gold velvet robe, golden crown, regal confident pose' },
  { id: 'look_legendaire', prompt: 'wearing a legendary golden outfit: full shimmering gold armor with intricate engravings, majestic flowing cape, radiating a soft golden glow' },
]

async function generateLook({ id, prompt }) {
  const outPath = join(root, 'public', 'looks', `${id}.png`)
  if (existsSync(outPath)) {
    console.log(`↷ ${id} déjà généré, ignoré`)
    return
  }
  console.log(`… génération ${id}`)
  const res = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-image-1',
      prompt: STYLE_PREFIX + prompt,
      size: '1024x1536',
      quality: 'high',
      background: 'transparent',
      n: 1,
    }),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`${id}: HTTP ${res.status} — ${text}`)
  }
  const json = await res.json()
  const b64 = json.data?.[0]?.b64_json
  if (!b64) throw new Error(`${id}: pas de b64_json dans la réponse — ${JSON.stringify(json).slice(0, 300)}`)
  writeFileSync(outPath, Buffer.from(b64, 'base64'))
  console.log(`✓ ${id} → public/looks/${id}.png`)
}

for (const look of LOOKS) {
  await generateLook(look)
}
console.log('Terminé.')
