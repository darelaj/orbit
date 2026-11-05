import InventoryWorkspace from '../features/inventory/InventoryWorkspace';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { initialTheme, persistTheme } from './theme';
import { demoRelics, slots, type DemoRelic, type Slot } from './demo';
import { FigmaIcon, GameImage, RelicCard, RelicDetails } from './Equipment';
import { CharacterEquipment, InventoryFilters, ScannerGuide, type LockFilter, type SortOrder } from './Workspace';

export default function App() {
  const [theme, setTheme] = useState(initialTheme);
  const [themeStored, setThemeStored] = useState(true);
  const [demo, setDemo] = useState(true);
  const [hasInventory, setHasInventory] = useState(false);
  const [view, setView] = useState<'inventory'|'comparison'>(() => location.hash === '#comparison' ? 'comparison' : 'inventory');
  useEffect(() => { const syncView = () => setView(location.hash === '#comparison' ? 'comparison' : 'inventory'); window.addEventListener('hashchange', syncView); return () => window.removeEventListener('hashchange', syncView); }, []);
  const [slot, setSlot] = useState<Slot | 'all'>('all');
  const [query, setQuery] = useState('');
  const [lockFilter, setLockFilter] = useState<LockFilter>('all');
  const [sortOrder, setSortOrder] = useState<SortOrder>('equipped');
  const [selectedId, setSelectedId] = useState('demo-body-01');
  const guide = useRef<HTMLDialogElement>(null);
  const detail = useRef<HTMLDialogElement>(null);
  useLayoutEffect(() => { document.documentElement.dataset.theme = theme; }, [theme]);

  const selected = demo ? demoRelics.find(relic => relic.id === selectedId) : undefined;
  const search = query.trim().toLowerCase();
  const visibleRelics = demo ? demoRelics.filter(relic =>
    (slot === 'all' || relic.slot === slot) &&
    (lockFilter === 'all' || relic.locked === (lockFilter === 'locked')) &&
    `${relic.name} ${relic.set} ${relic.main[0]}`.toLowerCase().includes(search)
  ).sort((a, b) => sortOrder === 'equipped' ? Number(b.equipped) - Number(a.equipped) :
    (slots.indexOf(a.slot) - slots.indexOf(b.slot)) * (sortOrder === 'slot' ? 1 : -1)) : [];
  const hasFilters = slot !== 'all' || query !== '' || lockFilter !== 'all' || sortOrder !== 'equipped';
  const selectedHidden = !!selected && !visibleRelics.some(relic => relic.id === selectedId);
  const selectedIndex = visibleRelics.findIndex(relic => relic.id === selectedId);
  const selectedPosition = selectedIndex >= 0 ? `${String(selectedIndex + 1).padStart(2, '0')} / ${String(visibleRelics.length).padStart(2, '0')}` : 'Outside results';

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next); setThemeStored(persistTheme(next));
  }
  function resetFilters() { setSlot('all'); setQuery(''); setLockFilter('all'); setSortOrder('equipped'); }
  function selectRelic(relic: DemoRelic) {
    setSelectedId(relic.id);
    if (globalThis.matchMedia?.('(max-width: 1099px)').matches) detail.current?.showModal();
  }
  function toggleDemo() { setView('inventory'); location.hash = 'inventory'; setDemo(!demo); resetFilters(); setSelectedId('demo-body-01'); }

  return <div className="app">
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="app-header">
      <a className="wordmark" href="#inventory" aria-label="Orbit, relic inventory">ORBIT</a>
      <nav className="main-nav" aria-label="Workspace"><a href="#inventory" onClick={() => setView('inventory')} aria-current={view === 'inventory' ? 'page' : undefined}>Inventory</a><a href="#comparison" onClick={() => setView('comparison')} aria-current={view === 'comparison' ? 'page' : undefined}>Comparison</a><button onClick={() => guide.current?.showModal()}>Scanner guide</button></nav>
      <div className="header-actions"><span className="local-label">Local workspace · No account</span><button className="theme-toggle" onClick={toggleTheme} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`} title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}><FigmaIcon name="theme" /></button></div>
    </header>
    <main id="main" tabIndex={-1}>
      {!themeStored ? <p className="notice" role="status">Theme changed for this session. Your browser could not save the preference.</p> : null}
      <div className="page-heading" id="inventory"><div><p className="eyebrow">Honkai: Star Rail / Relic workspace</p><h1>{view === 'comparison' ? 'Build comparison' : demo || hasInventory ? 'Relic workspace' : 'Your inventory is empty'}</h1></div><div className="page-actions">{demo ? <span className="demo-label">Demo · 8 synthetic relics</span> : null}<button className={demo ? 'quiet-button' : 'primary'} onClick={toggleDemo}>{demo ? 'Exit demo' : 'Open demo'}</button></div></div>
      <InventoryWorkspace comparisonVisible={view === 'comparison'} visible={!demo && view === 'inventory'} onInventory={() => { setHasInventory(true); setDemo(false); }} />
      {view === 'comparison' ? null : demo ? <div className="equipment-workspace">
        <div className="collection-workspace">
          <CharacterEquipment selectedId={selectedId} onSelect={selectRelic} />
          <section className="inventory-panel" aria-labelledby="collection-heading">
            <div className="collection-heading"><h2 id="collection-heading">Relic collection</h2><span className="numeric" aria-live="polite" role="status">{visibleRelics.length} of {demoRelics.length} relics</span></div>
            <InventoryFilters query={query} onQuery={setQuery} slot={slot} onSlot={setSlot} lockFilter={lockFilter} onLock={setLockFilter} sortOrder={sortOrder} onSort={setSortOrder} onReset={resetFilters} hasFilters={hasFilters} />
            {selectedHidden && visibleRelics.length > 0 ? <div className="selection-notice"><p>Your selected relic is hidden by the filters.</p><button onClick={resetFilters}>Show selected relic</button></div> : null}
            {visibleRelics.length ? <div className="relic-grid" aria-label="Relic results">{visibleRelics.map(relic => <RelicCard key={relic.id} relic={relic} selected={selectedId === relic.id} onSelect={() => selectRelic(relic)} />)}</div> : <div className="no-results"><h3>No matching relics</h3><p>Try another search or reset the filters to view the collection.</p><button onClick={resetFilters}>Show all relics</button></div>}
          </section>
        </div>
        <aside className="detail-panel" aria-label="Selected relic"><RelicDetails relic={selected} position={selectedPosition} /></aside>
      </div> : !hasInventory ? <div className="empty-workspace">
        <section className="empty-demo" aria-labelledby="empty-heading"><div className="empty-art" aria-hidden="true">{['117_0.png','117_2.png','117_3.png'].map(file => <GameImage key={file} file={file} alt="" />)}</div><h2 id="empty-heading">Start with the demo</h2><p>Explore Acheron's equipment with eight synthetic relics. The demo is not connected to a game account.</p><button className="primary" onClick={toggleDemo}>Explore demo</button><p className="fineprint">Import a scanner JSON above to open your own inventory.</p></section>
        <section className="preparation-panel" aria-label="Prepare your inventory"><ScannerGuide /></section>
      </div> : null}
    </main>
    <footer className="app-footer"><span>Orbit / Local relic workspace</span><div><a href="https://github.com/darelaj/orbit" target="_blank" rel="noreferrer">Source Orbit</a><a href="https://github.com/darelaj/orbit/blob/main/docs/ASSETS.md" target="_blank" rel="noreferrer">Asset &amp; font credits</a></div></footer>
    <dialog ref={guide} className="guide-dialog" aria-labelledby="guide-heading"><div className="dialog-header"><h2 id="guide-heading">Scanner guide</h2><button onClick={() => guide.current?.close()} aria-label="Close guide">Close</button></div><ScannerGuide /></dialog>
    <dialog ref={detail} className="detail-dialog" aria-label="Selected relic details"><div className="dialog-header"><button onClick={() => detail.current?.close()}>Back to collection</button><span className="demo-label">Synthetic demo</span></div><RelicDetails relic={selected} position={selectedPosition} /></dialog>
  </div>;
}
