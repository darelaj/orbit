import ComparisonWorkspace from '../comparison/ComparisonWorkspace';
import { catalogueItem, formatMainStat } from '../../domain/catalogue';
import { GameImage } from '../../app/Equipment';
import { useEffect, useRef, useState } from 'react';
import { backupInventory, referenceWarnings, inventorySlots, MAX_BYTES, parseInventory, type Inventory, type InventoryRelic, type Stat } from '../../domain/inventory';
import { loadInventory, saveInventory } from '../../storage/inventory';
import './inventory.css';

function StatList({ stats }: { stats: Stat[] }) {
  return <dl className="stat-ledger">{stats.map(s => <div key={s.key}><dt>{s.key.replace('_', ' %')}</dt><dd>{s.value}</dd></div>)}</dl>;
}
function Details({ relic, inventory }: { relic: InventoryRelic; inventory: Inventory }) {
  const item = catalogueItem(relic);
  const owner = inventory.characters.find(c => c.id === relic.location)?.name;
  return <><h2>{relic.slot} · {relic.rarity}★ · +{relic.level}</h2><h3>{item?.name ?? relic.setName}</h3>{item ? <GameImage key={item.icon} file={`relic/${item.icon}`} alt={item.name} /> : <p>Artwork unavailable for this set/slot.</p>}<p>{relic.setName}</p><p>Main stat: {relic.mainStat} {formatMainStat(relic)} (catalogue-derived)</p><h3>Active substats</h3><StatList stats={relic.substats} />
    {relic.preview.length > 0 && <><h3>Preview · inactive</h3><StatList stats={relic.preview} /></>}
    {relic.reroll.length > 0 && <><h3>Reroll · alternative</h3><StatList stats={relic.reroll} /></>}
    <p>Equipped by: {owner ?? (relic.location ? 'Character ' + relic.location : 'Not equipped')}</p><p>{relic.locked ? 'Locked' : 'Unlocked'} · {relic.discarded ? 'Marked for discard' : 'Not marked for discard'}</p><p>Scanner ID: {relic.id} · Set ID: {relic.setId}</p></>;
}
export default function InventoryWorkspace({ visible, onInventory, comparisonVisible = false, optimizerVisible = false }: { visible: boolean; onInventory: () => void; comparisonVisible?: boolean; optimizerVisible?: boolean }) {
  const [inventory, setInventory] = useState<Inventory | null>(null);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState('');
  const [pending, setPending] = useState<Inventory | null>(null);
  const [query, setQuery] = useState('');
  const [slot, setSlot] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(0);
  const [extra, setExtra] = useState({ set: '', main: '', rarity: '', level: '', owner: '' });
  function resetExtra() { setExtra({ set: '', main: '', rarity: '', level: '', owner: '' }); }
  const [selected, setSelected] = useState('');
  const detail = useRef<HTMLDialogElement>(null);
  const onInventoryRef = useRef(onInventory);
  onInventoryRef.current = onInventory;
  useEffect(() => {
    let active = true;
    loadInventory().then(value => { if (active && value) { setInventory(value); onInventoryRef.current(); } })
      .catch(reason => { if (active) setError(reason instanceof Error ? reason.message : 'Local storage is unavailable.'); })
      .finally(() => { if (active) setBusy(false); });
    return () => { active = false; };
  }, []);
  async function read(file: File | undefined) {
    if (!file) return;
    setBusy(true); setError(''); setPending(null);
    try {
      if (file.size > MAX_BYTES) throw new Error('File: maximum size is 20 MiB');
      setPending(parseInventory(await file.text()));
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Could not read this file.'); }
    finally { setBusy(false); }
  }
  async function commit() {
    if (!pending) return;
    setBusy(true); setError('');
    try {
      await saveInventory(pending);
      resetExtra(); setInventory(pending); setPending(null); setSelected(''); setQuery(''); setSlot(''); setStatus(''); setPage(0); onInventory();
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Could not save inventory.'); }
    finally { setBusy(false); }
  }
  function backup() {
    if (!inventory) return;
    const url = URL.createObjectURL(new Blob([backupInventory(inventory)], { type: 'application/json' }));
    const a = document.createElement('a'); a.href = url; a.download = 'orbit-inventory.json'; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  const filtered = inventory?.relics.filter(r => (!slot || r.slot === slot) &&
    (!status || (status === 'locked' ? r.locked : status === 'unlocked' ? !r.locked : status === 'kept' ? !r.discarded : status === 'discarded' ? r.discarded : status === 'equipped' ? !!r.location : !r.location)) &&
    (!extra.set || r.setId === extra.set) && (!extra.main || r.mainStat === extra.main) &&
    (!extra.rarity || r.rarity === Number(extra.rarity)) && (!extra.level || r.level >= Number(extra.level)) && (!extra.owner || r.location === extra.owner) &&
    `${r.setName} ${r.setId} ${r.id} ${r.mainStat} ${r.location} ${inventory.characters.find(c => c.id === r.location)?.name ?? ""} ${catalogueItem(r)?.name ?? ""}`.toLowerCase().includes(query.trim().toLowerCase())) ?? [];
  const pages = Math.max(1, Math.ceil(filtered.length / 48));
  const currentPage = Math.min(page, pages - 1);
  const chosen = inventory?.relics.find(r => r.id === selected);
  return <section className="import-workspace" aria-label="Personal inventory">
    <div className="import-toolbar"><label>Import scanner JSON or Orbit backup<input type="file" accept=".json,application/json" disabled={busy} onChange={event => { void read(event.target.files?.[0]); event.target.value = ''; }} /></label><button disabled={!inventory || busy} onClick={backup}>Download backup</button></div>
    {busy && <p role="status">Reading local inventory…</p>}
    {error && <p role="alert">{error}</p>}
    {pending && <div className="notice"><p>{pending.relics.length} relics from {pending.source}. Import replaces your saved inventory, including when this file is empty. Demo data is kept separate.</p><button disabled={busy} onClick={() => void commit()}>Replace inventory</button><button disabled={busy} onClick={() => setPending(null)}>Cancel import</button></div>}
    <div hidden={!comparisonVisible && !optimizerVisible}><ComparisonWorkspace optimizerVisible={optimizerVisible} inventory={inventory} /></div>
    {visible && inventory && <>
      <p>Imported {inventory.importedAt ? new Date(inventory.importedAt).toLocaleString() : 'time unavailable (legacy backup)'} · {inventory.source} · Schema {inventory.version} · {inventory.precision === 'ocr' ? 'OCR: hidden SPD decimals unavailable' : 'Packet-derived values: imported precision retained'}</p>
      <div className="filter-fields"><label>Search inventory<input type="search" value={query} onChange={e => { setQuery(e.target.value); setPage(0); }} /></label><label>Inventory slot<select value={slot} onChange={e => { setSlot(e.target.value); setPage(0); }}><option value="">All slots</option>{inventorySlots.map(s => <option key={s}>{s}</option>)}</select></label><label>Inventory status<select value={status} onChange={e => { setStatus(e.target.value); setPage(0); }}><option value="">All items</option><option value="locked">Locked</option><option value="unlocked">Unlocked</option><option value="kept">Not marked for discard</option><option value="discarded">Marked for discard</option><option value="equipped">Equipped</option><option value="stored">Not equipped</option></select></label><button onClick={() => { resetExtra(); setQuery(''); setSlot(''); setStatus(''); setPage(0); }}>Reset inventory filters</button></div>
            <div className="filter-fields">{([
        ['set', 'Relic set', [...new Map(inventory.relics.map(r => [r.setId, r.setName])).entries()]],
        ['main', 'Main stat', [...new Set(inventory.relics.map(r => r.mainStat))].sort().map(s => [s, s])],
        ['rarity', 'Rarity', ['2','3','4','5'].map(s => [s, `${s} stars`])],
        ['level', 'Minimum level', Array.from({length:16}, (_,i) => [String(i), `+${i}`])],
        ['owner', 'Equipped character', [...new Set(inventory.relics.map(r => r.location).filter(Boolean))].map(id => [id, inventory.characters.find(c => c.id === id)?.name ?? `Character ${id}`])],
      ] satisfies [keyof typeof extra, string, string[][]][]).map(([key, label, options]) => <label key={key}>{label}<select value={extra[key]} onChange={e => { setExtra({...extra, [key]:e.target.value}); setPage(0); }}><option value="">All</option>{options.map(([value, text]) => <option key={value} value={value}>{text}</option>)}</select></label>)}</div>
      {referenceWarnings(inventory).length > 0 && <details><summary>Missing character references ({referenceWarnings(inventory).length})</summary>{referenceWarnings(inventory).map(w => <p key={w}>{w}</p>)}</details>}
      <p aria-live="polite">{filtered.length} of {inventory.relics.length} imported relics</p>
      <div className="equipment-workspace"><div>
        {!filtered.length && <p>No relics to display. Reset filters or import another file.</p>}
        <div className="relic-grid">{filtered.slice(currentPage * 48, (currentPage + 1) * 48).map(r => <button key={r.id} className="relic-card imported-card" aria-pressed={r.id === selected} onClick={() => { setSelected(r.id); if (globalThis.matchMedia?.('(max-width: 1099px)').matches) detail.current?.showModal(); }}><span>{r.slot} · {r.rarity}★ · +{r.level}</span><span className="imported-identity">{catalogueItem(r) ? <GameImage file={`relic/${catalogueItem(r)!.icon}`} alt="" /> : <span>Artwork unavailable</span>}<strong>{catalogueItem(r)?.name ?? r.setName}</strong></span><span>{r.setName}</span><span>{r.mainStat} <b>{formatMainStat(r)}</b></span><StatList stats={r.substats} /><span>{r.location ? inventory.characters.find(c => c.id === r.location)?.name ?? `Character ${r.location}` : 'Not equipped'} · {r.locked ? 'Locked' : 'Unlocked'}{r.discarded ? ' · Discard' : ''}</span><small>ID {r.id}</small></button>)}</div>
        <div className="inventory-pagination"><button disabled={currentPage === 0} onClick={() => setPage(currentPage - 1)}>Previous page</button><span>Page {currentPage + 1} of {pages}</span><button disabled={currentPage + 1 >= pages} onClick={() => setPage(currentPage + 1)}>Next page</button></div>
      </div><aside className="detail-panel" aria-label="Imported relic details">{chosen ? <Details relic={chosen} inventory={inventory} /> : <p>Select an imported relic to inspect it.</p>}</aside></div>
      <dialog ref={detail} className="detail-dialog" aria-label="Imported relic details"><button onClick={() => detail.current?.close()}>Back to inventory</button>{chosen && <Details relic={chosen} inventory={inventory} />}</dialog>
    </>}
  </section>;
}
