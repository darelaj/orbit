import { useState } from 'react';
import type { DemoRelic } from './demo';
import { slotNames } from './demo';

type IconName = 'theme' | 'search' | 'lock' | 'unlock' | 'detail-lock';
const iconFiles: Record<IconName, { dark: string; light: string; size: number }> = {
  theme: { dark: 'dark-imgMoon.svg', light: 'light-imgSun.svg', size: 18 },
  search: { dark: 'dark-imgSearch.svg', light: 'light-imgSearch.svg', size: 18 },
  lock: { dark: 'dark-imgLockKeyhole.svg', light: 'light-imgLockKeyhole.svg', size: 13 },
  unlock: { dark: 'dark-imgLockOpen.svg', light: 'light-imgLockOpen.svg', size: 13 },
  'detail-lock': { dark: 'dark-imgLockKeyhole1.svg', light: 'light-imgLockKeyhole1.svg', size: 16 },
};

export function FigmaIcon({ name }: { name: IconName }) {
  const icon = iconFiles[name];
  return <span className="figma-icon" aria-hidden="true">
    <img className="icon-dark" src={`/assets/figma/${icon.dark}`} width={icon.size} height={icon.size} alt="" />
    <img className="icon-light" src={`/assets/figma/${icon.light}`} width={icon.size} height={icon.size} alt="" />
  </span>;
}

export function GameImage({ file, alt, character = false }: { file: string; alt: string; character?: boolean }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <span className="image-fallback" role={alt ? 'img' : 'presentation'} aria-label={alt || undefined} aria-hidden={alt ? undefined : true}>{character ? 'Artwork unavailable' : 'Image unavailable'}</span>;
  return <img src={`/assets/hsr/${file}`} alt={alt} width={character ? 2048 : 128} height={character ? 2048 : 128} fetchPriority={character ? 'high' : 'auto'} onError={() => setFailed(true)} />;
}

export function RelicDetails({ relic, position }: { relic: DemoRelic | undefined; position: string }) {
  if (!relic) return <div className="detail-empty"><h2>Relic details</h2><p>Select a relic from the collection to inspect its stats.</p></div>;
  return (
    <div className="relic-details" key={relic.id}>
      <div className="detail-heading"><h2>Relic details</h2><span className="numeric">{position}</span></div>
      <div className="detail-status"><span>{slotNames[relic.slot]} selected</span><span>5★ · +15</span></div>
      <div className="detail-art"><GameImage file={relic.image} alt={relic.name} /></div>
      <h3>{relic.name}</h3>
      <p className="set-name">{relic.set}</p>
      <div className="detail-main"><span>{relic.main[0]}</span><strong>{relic.main[1]}</strong></div>
      <dl className="stat-ledger">{relic.substats.map(([stat, value]) => <div key={stat}><dt>{stat}</dt><dd>{value}</dd></div>)}</dl>
      <dl className="item-meta"><div><dt>Equipped by</dt><dd>{relic.equipped ? 'Acheron' : 'Not equipped'}</dd></div></dl>
      <p className="lock-status"><FigmaIcon name={relic.locked ? 'detail-lock' : 'unlock'} />{relic.locked ? 'Locked' : 'Unlocked'}</p>
      <details className="source-info"><summary>Source &amp; precision</summary><p>These synthetic relics are demo data, not your inventory. Their values are not used to calculate build stats or damage.</p><p className="item-id">Demo ID: {relic.id}</p></details>
    </div>
  );
}

export function RelicCard({ relic, selected, onSelect }: { relic: DemoRelic; selected: boolean; onSelect: () => void }) {
  return (
    <button id={relic.id} className="relic-card" aria-pressed={selected} onClick={onSelect} aria-label={`${slotNames[relic.slot]}: ${relic.name}, ${relic.main[0]} ${relic.main[1]}, ${relic.equipped ? 'equipped' : 'stored'}`}>
      <span className="card-topline"><span>{slotNames[relic.slot]}</span><span className="rarity">5★ · +15</span></span>
      <span className="card-identity"><span className="card-icon"><GameImage file={relic.image} alt="" /></span><span className="card-names"><strong>{relic.shortName}</strong><span>{relic.shortSet}</span></span></span>
      <span className="card-primary"><span>{relic.main[0]}</span><strong>{relic.main[1]}</strong></span>
      <span className="card-substats">{relic.substats.map(([stat, value]) => <span key={stat}><span>{stat}</span><b>{value}</b></span>)}</span>
      <span className="card-footer"><span><FigmaIcon name={relic.locked ? 'lock' : 'unlock'} />{relic.equipped ? 'Acheron' : 'Stored'}</span><span>{relic.locked ? 'Locked' : 'Unlocked'}</span></span>
      {selected ? <span className="sr-only">Selected relic</span> : null}
    </button>
  );
}
