import { useState } from 'react'
import { drawTier } from './content/rewardTiers'

const OPEN_DURATION_MS = 900

export default function Chests({ count, onOpen, onExit }) {
  const [phase, setPhase] = useState('idle') // 'idle' | 'opening' | 'result'
  const [tier, setTier] = useState(null)

  function open() {
    if (count <= 0 || phase !== 'idle') return
    setPhase('opening')
    setTimeout(() => {
      const result = drawTier()
      setTier(result)
      setPhase('result')
      onOpen(result.coins)
    }, OPEN_DURATION_MS)
  }

  function again() {
    setPhase('idle')
    setTier(null)
  }

  return (
    <div className="screen-center">
      <div className="card center">
        <h1>🎁 Coffres</h1>
        <p className="muted">{count} coffre{count > 1 ? 's' : ''} à ouvrir — gagnés en terminant une partie de quiz.</p>

        <div className={`chest-box ${phase === 'opening' ? 'opening' : ''}`}>
          <span className="chest-emoji">{phase === 'result' ? tier.emoji : '🎁'}</span>
        </div>

        {phase === 'result' && (
          <>
            <p className="tier-label">{tier.label} — +{tier.coins} pièces</p>
            {count > 0 && <button onClick={again}>Ouvrir un autre coffre</button>}
          </>
        )}

        {phase === 'idle' && (
          <button disabled={count <= 0} onClick={open}>
            {count > 0 ? 'Ouvrir un coffre' : 'Aucun coffre pour l’instant'}
          </button>
        )}

        <button className="link" onClick={onExit}>Retour</button>
      </div>
    </div>
  )
}
