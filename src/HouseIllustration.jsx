// Illustrations de maison dessinées à la main (SVG), une par palier — pas de dégradé de
// couleur générique : chaque niveau a ses propres éléments, de plus en plus riches.
const ILLUSTRATIONS = {
  house_rue: (
    <svg viewBox="0 0 200 260" className="house-svg">
      <rect width="200" height="260" fill="#8fb0c9" />
      <rect y="190" width="200" height="70" fill="#6b7d6f" />
      <rect y="185" width="200" height="8" fill="#a9a9a9" />
      <rect x="30" y="80" width="6" height="105" fill="#5b4636" />
      <circle cx="33" cy="72" r="14" fill="#ffe9a8" opacity="0.8" />
      <rect x="150" y="150" width="30" height="40" fill="#7a6a55" />
      <rect x="158" y="160" width="6" height="10" fill="#4a4a4a" />
      <circle cx="60" cy="40" r="18" fill="#fff" opacity="0.5" />
      <circle cx="140" cy="55" r="12" fill="#fff" opacity="0.4" />
    </svg>
  ),
  house_chambre: (
    <svg viewBox="0 0 200 260" className="house-svg">
      <rect width="200" height="260" fill="#e8ddc8" />
      <rect x="20" y="90" width="160" height="130" fill="#c9a876" />
      <polygon points="10,90 100,40 190,90" fill="#8a5a3b" />
      <rect x="85" y="150" width="30" height="70" fill="#5b4636" />
      <rect x="40" y="120" width="30" height="30" fill="#bcdcEA" />
      <rect x="130" y="120" width="30" height="30" fill="#bcdcEA" />
      <rect x="0" y="220" width="200" height="40" fill="#7fa06a" />
    </svg>
  ),
  house_studio: (
    <svg viewBox="0 0 200 260" className="house-svg">
      <rect width="200" height="260" fill="#cfe3e8" />
      <rect x="30" y="70" width="140" height="150" fill="#e4e4e4" />
      <rect x="30" y="70" width="140" height="10" fill="#8fb8c4" />
      <rect x="50" y="100" width="35" height="35" fill="#4a7a8c" />
      <rect x="115" y="100" width="35" height="35" fill="#4a7a8c" />
      <rect x="85" y="160" width="30" height="60" fill="#3a3a3a" />
      <rect x="30" y="210" width="140" height="10" fill="#b0b0b0" />
      <rect x="0" y="220" width="200" height="40" fill="#8fae95" />
      <rect x="160" y="40" width="6" height="35" fill="#555" />
      <circle cx="163" cy="35" r="5" fill="#e0662f" />
    </svg>
  ),
  house_appartement: (
    <svg viewBox="0 0 200 260" className="house-svg">
      <rect width="200" height="260" fill="#c9e3d2" />
      <rect x="40" y="30" width="120" height="190" fill="#dcd3c3" />
      <rect x="55" y="50" width="24" height="24" fill="#5f9bb0" />
      <rect x="90" y="50" width="24" height="24" fill="#5f9bb0" />
      <rect x="125" y="50" width="24" height="24" fill="#5f9bb0" />
      <rect x="55" y="90" width="24" height="24" fill="#5f9bb0" />
      <rect x="90" y="90" width="24" height="24" fill="#5f9bb0" />
      <rect x="125" y="90" width="24" height="24" fill="#5f9bb0" />
      <rect x="55" y="130" width="24" height="24" fill="#5f9bb0" />
      <rect x="125" y="130" width="24" height="24" fill="#5f9bb0" />
      <rect x="88" y="160" width="24" height="60" fill="#3a3a3a" />
      <rect x="0" y="220" width="200" height="40" fill="#6fb894" />
      <rect x="20" y="225" width="10" height="12" fill="#4a8f6a" />
      <rect x="170" y="225" width="10" height="12" fill="#4a8f6a" />
    </svg>
  ),
  house_villa: (
    <svg viewBox="0 0 200 260" className="house-svg">
      <rect width="200" height="260" fill="#ffe3b0" />
      <rect x="20" y="110" width="160" height="110" fill="#f4ede1" />
      <polygon points="10,110 100,55 190,110" fill="#c77b3b" />
      <rect x="85" y="160" width="30" height="60" fill="#6b4a2b" />
      <rect x="40" y="130" width="28" height="28" fill="#8fc7e0" />
      <rect x="132" y="130" width="28" height="28" fill="#8fc7e0" />
      <rect x="0" y="220" width="200" height="40" fill="#7fbf7a" />
      <circle cx="30" cy="235" r="10" fill="#4a9c4a" />
      <circle cx="170" cy="235" r="10" fill="#4a9c4a" />
      <rect x="60" y="215" width="80" height="6" fill="#c9a876" />
      <polygon points="20,110 20,95 35,95 35,110" fill="#c77b3b" />
    </svg>
  ),
  house_chateau: (
    <svg viewBox="0 0 200 260" className="house-svg">
      <rect width="200" height="260" fill="#e6d3ff" />
      <rect x="30" y="120" width="140" height="100" fill="#cbb9dd" />
      <rect x="20" y="90" width="30" height="40" fill="#a97bdb" />
      <polygon points="20,90 35,70 50,90" fill="#6a3fa0" />
      <rect x="150" y="90" width="30" height="40" fill="#a97bdb" />
      <polygon points="150,90 165,70 180,90" fill="#6a3fa0" />
      <rect x="85" y="60" width="30" height="70" fill="#a97bdb" />
      <polygon points="85,60 100,35 115,60" fill="#6a3fa0" />
      <rect x="96" y="45" width="8" height="16" fill="#f4d150" />
      <rect x="88" y="160" width="24" height="60" fill="#3a2a4a" />
      <rect x="50" y="150" width="20" height="20" fill="#f4ede1" />
      <rect x="130" y="150" width="20" height="20" fill="#f4ede1" />
      <rect x="0" y="220" width="200" height="40" fill="#8a6fb0" />
    </svg>
  ),
}

export default function HouseIllustration({ id }) {
  return ILLUSTRATIONS[id] || ILLUSTRATIONS.house_rue
}
