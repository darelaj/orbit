import { useState } from 'react';
import type { DemoRelic } from './demo';

export function GameImage({ file, alt, character = false }: { file: string; alt: string; character?: boolean }) {
  const [failed, setFailed] = useState(false);
  return failed ? <span className="image-fallback" role={alt ? 'img' : 'presentation'} aria-label={alt || undefined} aria-hidden={alt ? undefined : true}>{character ? 'Artwork tidak tersedia' : 'Gambar tidak tersedia'}</span> : (
    <img src={`/assets/hsr/${file}`} alt={alt} width={character ? 2048 : 256} height={character ? 2048 : 256} fetchPriority={character ? 'high' : 'auto'} onError={() => setFailed(true)} />
  );
}

export function RelicDetails({ relic }: { relic: DemoRelic | undefined }) {
  if (!relic) return <div className="detail-empty"><span className="section-caption">Detail relic</span><h2>Pilih satu relic.</h2><p>Stat utama dan substat aktif akan tampil di sini.</p></div>;
  return (
    <div className="relic-details" key={relic.id}>
      <div className="detail-heading"><span className="section-caption">Detail relic</span><span>{relic.slot} / +15</span></div>
      <div className="detail-art"><GameImage file={relic.image} alt={relic.name} /><span className="rarity">5★</span></div>
      <h2>{relic.name}</h2><p className="set-name">{relic.set}</p>
      <div className="detail-main"><span>{relic.main[0]}</span><strong>{relic.main[1]}</strong><small>Stat utama</small></div>
      <h3>Substat aktif</h3>
      <dl className="stat-ledger">{relic.substats.map(([stat, value]) => <div key={stat}><dt>{stat}</dt><dd>{value}</dd></div>)}</dl>
      <dl className="item-meta"><div><dt>Dipakai oleh</dt><dd>{relic.equipped ? 'Acheron (demo)' : 'Belum dipakai'}</dd></div><div><dt>Status</dt><dd>{relic.locked ? 'Terkunci' : 'Tidak terkunci'}</dd></div><div><dt>Identitas demo</dt><dd>{relic.id}</dd></div></dl>
      <p className="precision-note">Angka sintetis untuk pratinjau UI. Bukan hasil scan, stat build, atau perhitungan damage.</p>
    </div>
  );
}

export function RelicCard({ relic, selected, onSelect }: { relic: DemoRelic; selected: boolean; onSelect: () => void }) {
  return (
    <button className="relic-card" aria-pressed={selected} onClick={onSelect} aria-label={`${relic.slot}: ${relic.name}, ${relic.main[0]} ${relic.main[1]}, ${relic.equipped ? 'dipakai' : 'tersimpan'}`}>
      <span className="card-topline"><span>{relic.slot}</span><span className="level">+15</span></span>
      <span className="card-equipment"><span className="card-icon"><GameImage file={relic.image} alt="" /></span><span className="card-primary"><span className="rarity">5★</span><span>{relic.main[0]}</span><strong>{relic.main[1]}</strong></span></span>
      <span className="card-name">{relic.name}</span>
      <span className="card-substats">{relic.substats.map(([stat, value]) => <span key={stat}><span>{stat}</span><b>{value}</b></span>)}</span>
      <span className="card-state"><span>{relic.equipped ? 'Acheron · demo' : 'Tersimpan'}</span><span>{relic.locked ? 'Terkunci' : 'Tidak terkunci'}</span></span>
    </button>
  );
}
