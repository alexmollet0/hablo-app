import { useState } from 'react'
import { SHOP_CATEGORIES, itemsForCategory, getEquipped } from './content/shopItems'
import AvatarDisplay, { LookImage } from './AvatarDisplay'
import HouseIllustration from './HouseIllustration'

export default function Shop({ profile, onBuy, onEquip, onExit }) {
  const [category, setCategory] = useState('look')
  const items = itemsForCategory(category)
  const equippedId = getEquipped(profile, category).id
  const owned = profile.owned_items || []

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
                {category === 'look' ? (
                  <LookImage look={item} size={56} />
                ) : (
                  <div className="shop-item-swatch"><HouseIllustration id={item.id} /></div>
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
          Looks générés par IA (OpenAI). Illustrations de maison dessinées pour Hablo.
        </p>
      </div>
    </div>
  )
}
