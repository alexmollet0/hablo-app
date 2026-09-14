import { getEquipped } from './content/shopItems'

export default function AvatarDisplay({ profile }) {
  const avatar = getEquipped(profile, 'avatar')
  const accessoire = getEquipped(profile, 'accessoire')
  const maison = getEquipped(profile, 'maison')

  return (
    <div className="avatar-display">
      <div className="avatar-frame">
        <span className="avatar-emoji">{avatar.emoji}</span>
        {accessoire.emoji && <span className="avatar-accessory">{accessoire.emoji}</span>}
      </div>
      <p className="avatar-house">{maison.emoji} {maison.name}</p>
    </div>
  )
}
