import { getEquipped } from './content/shopItems'
import { buildDicebearOptions, avatarDataUri } from './avatarEngine'

export function CharacterImage({ profile, overrides, size = 96 }) {
  const dataUri = avatarDataUri(buildDicebearOptions(profile, overrides))
  return <img src={dataUri} alt="" className="avatar-image" style={{ width: size, height: size }} />
}

export default function AvatarDisplay({ profile }) {
  const maison = getEquipped(profile, 'maison')

  return (
    <div className="avatar-display">
      <div className="avatar-frame" style={{ background: `linear-gradient(160deg, ${maison.bg[0]}, ${maison.bg[1]})` }}>
        <CharacterImage profile={profile} size={110} />
      </div>
      <p className="avatar-house">{maison.name}</p>
    </div>
  )
}
