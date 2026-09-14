import { getEquipped } from './content/shopItems'
import HouseIllustration from './HouseIllustration'

export function LookImage({ look, size = 96 }) {
  return <img src={look.image} alt={look.name} className="avatar-image" style={{ height: size }} />
}

export default function AvatarDisplay({ profile }) {
  const look = getEquipped(profile, 'look')
  const maison = getEquipped(profile, 'maison')

  return (
    <div className="avatar-display">
      <div className="avatar-frame">
        <HouseIllustration id={maison.id} />
        <LookImage look={look} size={180} />
      </div>
      <p className="avatar-house">{maison.name}</p>
    </div>
  )
}
