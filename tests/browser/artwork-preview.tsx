import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { CharacterArtwork } from '../../src/app/CharacterArtwork';
import { characterArtwork } from '../../src/domain/character-art';
import data from '../../src/data/character-art.json';
import '../../src/app/styles.css';
import '../../src/app/fonts.css';

function Preview() {
  const [id, setId] = useState('1308');
  return <main className="app-shell"><h1>Artwork QA — public catalogue only</h1><button onClick={() => {document.documentElement.dataset.theme = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';}}>QA theme</button><label>Artwork character<select value={id} onChange={e => setId(e.target.value)}>{Object.entries(data.characters).map(([key, character]) => <option key={key} value={key}>{character.name} · {key}</option>)}<option value="unknown-fixture">Unavailable fixture</option></select></label><section className="character-equipment"><div className="character-banner"><div className={id==='1308'?'character-art':'character-art character-art-contained'}><CharacterArtwork id={id} /></div><div className="character-identity"><p className="eyebrow">Public artwork fixture</p><h2>{characterArtwork(id)?.name ?? 'Unknown character'}</h2><p>ID {id} · Artwork coverage is separate from stat support.</p></div></div></section></main>;
}
const root = createRoot(document.getElementById('root')!);
root.render(<Preview />);
if (import.meta.hot) import.meta.hot.dispose(() => root.unmount());
