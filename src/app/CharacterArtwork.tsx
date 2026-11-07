import { useState } from 'react';
import { characterArtwork } from '../domain/character-art';

function Unavailable({ alt }: { alt: string }) {
  return <span className="image-fallback" role="img" aria-label={alt}>Artwork unavailable</span>;
}
function Portrait({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false);
  return failed ? <Unavailable alt={alt} /> : <img src={src} alt={alt} width={2048} height={2048} fetchPriority="high" decoding="async" referrerPolicy="no-referrer" crossOrigin="anonymous" onError={() => setFailed(true)} />;
}
export function CharacterArtwork({ id, alt }: { id: string; alt?: string }) {
  const artwork = characterArtwork(id);
  const label = alt ?? `${artwork?.name ?? `Character ${id}`} artwork`;
  return artwork ? <Portrait key={artwork.url} src={artwork.url} alt={label} /> : <Unavailable alt={label} />;
}
