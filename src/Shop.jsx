import { useState } from 'react'
import { SHOP_CATEGORIES, itemsForCategory, getEquipped } from './content/shopItems'
import AvatarDisplay, { CharacterImage } from './AvatarDisplay'

export default function Shop({ profile, onBuy, onEquip, onExit }) {
  const [category, setCategory] = useState('hair')
  const items = itemsForCategory(category)
  const equippedId = getEquipped(profile, category).id
  const owned = profile.owned_items || []
  const isCharacterCategory = category !== 'maison'

  return (
    <div className="screen-center">
      <div className="card">
        <AvatarDisplay profile={profile} />
        <p className="muted center">🪙 {profile.coins}</p>
        <h1 className="center">Boutique</h1>
        <div className="tabs">
          {SHOP_CATEGORIES.map((c) => (
            <button
              key={c.key}
              className={category === c.key ? 'tab active' : 'tab'}
              onClick={() => setCategory(c.key)}
            >
              {c.label}
            </button>
          ))}
        </div>
        <div className="shop-grid">
          {items.map((item) => {
            const isOwned = owned.includes(item.id) || item.price === 0
            const isEquipped = item.id === equippedId
            const canAfford = profile.coins >= item.price
            return (
              <div key={item.id} className="shop-item">
                {isCharacterCategory ? (
                  <CharacterImage profile={profile} overrides={{ [category]: item }} size={56} />
                ) : (
                  <div
                    className="shop-item-swatch"
                    style={{ background: `linear-gradient(160deg, ${item.bg[0]}, ${item.bg[1]})` }}
                  />
                )}
                <p className="shop-item-name">{item.name}</p>
                {!isOwned && <p className="shop-item-price">🪙 {item.price}</p>}
                {isEquipped ? (
                  <button className="shop-btn equipped" disabled>Équipé</button>
                ) : isOwned ? (
                  <button className="shop-btn" onClick={() => onEquip(item)}>Équiper</button>
                ) : (
                  <button className="shop-btn" disabled={!canAfford} onClick={() => onBuy(item)}>
                    {canAfford ? 'Acheter' : 'Pas assez de pièces'}
                  </button>
                )}
              </div>
            )
          })}
        </div>
        <button className="link" onClick={onExit}>Retour</button>
        <p className="shop-credit">
          Avatars par <a href="https://www.dicebear.com" target="_blank" rel="noreferrer">DiceBear</a> (style Micah, <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer">CC BY 4.0</a>)
        </p>
      </div>
    </div>
  )
}
