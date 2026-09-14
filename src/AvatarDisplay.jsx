import { getEquipped } from './content/shopItems'

export function LookImage({ look, size = 96 }) {
  return <img src={look.image} alt={look.name} className="avatar-image" style={{ height: size }} />
}

export default function AvatarDisplay({ profile }) {
  const look = getEquipped(profile, 'look')
  const maison = getEquipped(profile, 'maison')
  const pet = getEquipped(profile, 'pet')

  return (
    <div className="avatar-display">
      <div className="avatar-frame">
        <img src={maison.image} alt={maison.name} className="house-photo" />
        <LookImage look={look} size={180} />
        {pet.image && <img src={pet.image} alt={pet.name} className="pet-image" />}
        <span className="level-badge">Nv. {profile.level}</span>
      </div>
      <p className="avatar-house">{maison.name}</p>
    </div>
  )
}
