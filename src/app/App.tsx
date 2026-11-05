import { useLayoutEffect, useRef, useState } from 'react';
import { initialTheme, persistTheme } from './theme';
import { demoRelics, slots, type DemoRelic, type Slot } from './demo';
import { FigmaIcon, GameImage, RelicCard, RelicDetails } from './Equipment';
import { CharacterEquipment, InventoryFilters, ScannerGuide, type LockFilter, type SortOrder } from './Workspace';

export default function App() {
  const [theme, setTheme] = useState(initialTheme);
  const [themeStored, setThemeStored] = useState(true);
  const [demo, setDemo] = useState(true);
  const [slot, setSlot] = useState<Slot | 'Semua'>('Semua');
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
    (slot === 'Semua' || relic.slot === slot) &&
    (lockFilter === 'all' || relic.locked === (lockFilter === 'locked')) &&
    `${relic.name} ${relic.set} ${relic.main[0]}`.toLowerCase().includes(search)
  ).sort((a, b) => sortOrder === 'equipped' ? Number(b.equipped) - Number(a.equipped) :
    (slots.indexOf(a.slot) - slots.indexOf(b.slot)) * (sortOrder === 'slot' ? 1 : -1)) : [];
  const hasFilters = slot !== 'Semua' || query !== '' || lockFilter !== 'all' || sortOrder !== 'equipped';
  const selectedHidden = !!selected && !visibleRelics.some(relic => relic.id === selectedId);
  const selectedIndex = visibleRelics.findIndex(relic => relic.id === selectedId);
  const selectedPosition = selectedIndex >= 0 ? `${String(selectedIndex + 1).padStart(2, '0')} / ${String(visibleRelics.length).padStart(2, '0')}` : 'Di luar hasil';

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next); setThemeStored(persistTheme(next));
  }
  function resetFilters() { setSlot('Semua'); setQuery(''); setLockFilter('all'); setSortOrder('equipped'); }
  function selectRelic(relic: DemoRelic) {
    setSelectedId(relic.id);
    if (globalThis.matchMedia?.('(max-width: 1099px)').matches) detail.current?.showModal();
  }
  function toggleDemo() { setDemo(!demo); resetFilters(); setSelectedId('demo-body-01'); }

  return <div className="app">
    <a className="skip-link" href="#main">Lewati navigasi</a>
    <header className="app-header">
      <a className="wordmark" href="#inventory" aria-label="Orbit, inventory relic">ORBIT</a>
      <nav className="main-nav" aria-label="Workspace"><a href="#inventory" aria-current="page">Inventaris</a><button onClick={() => guide.current?.showModal()}>Panduan scanner</button></nav>
      <div className="header-actions"><span className="local-label">Ruang kerja lokal · Tanpa akun</span><button className="theme-toggle" onClick={toggleTheme} aria-label={`Gunakan tema ${theme === 'dark' ? 'terang' : 'gelap'}`} title={`Gunakan tema ${theme === 'dark' ? 'terang' : 'gelap'}`}><FigmaIcon name="theme" /></button></div>
    </header>
    <main id="main" tabIndex={-1}>
      {!themeStored ? <p className="notice" role="status">Tema berubah untuk sesi ini. Browser tidak mengizinkan penyimpanan preferensi.</p> : null}
      <div className="page-heading" id="inventory"><div><p className="eyebrow">Honkai: Star Rail / Ruang relic</p><h1>{demo ? 'Meja perlengkapan' : 'Inventaris belum terisi'}</h1></div><div className="page-actions">{demo ? <span className="demo-label">Demo · 8 relic sintetis</span> : null}<button className={demo ? 'quiet-button' : 'primary'} onClick={toggleDemo}>{demo ? 'Keluar demo' : 'Buka demo'}</button></div></div>
      {demo ? <div className="equipment-workspace">
        <div className="collection-workspace">
          <CharacterEquipment selectedId={selectedId} onSelect={selectRelic} />
          <section className="inventory-panel" aria-labelledby="collection-heading">
            <div className="collection-heading"><h2 id="collection-heading">Koleksi relic</h2><span className="numeric" aria-live="polite" role="status">{visibleRelics.length} dari {demoRelics.length} relic</span></div>
            <InventoryFilters query={query} onQuery={setQuery} slot={slot} onSlot={setSlot} lockFilter={lockFilter} onLock={setLockFilter} sortOrder={sortOrder} onSort={setSortOrder} onReset={resetFilters} hasFilters={hasFilters} />
            {selectedHidden && visibleRelics.length > 0 ? <div className="selection-notice"><p>Relic terpilih tersembunyi oleh filter.</p><button onClick={resetFilters}>Tampilkan relic terpilih</button></div> : null}
            {visibleRelics.length ? <div className="relic-grid" aria-label="Hasil relic">{visibleRelics.map(relic => <RelicCard key={relic.id} relic={relic} selected={selectedId === relic.id} onSelect={() => selectRelic(relic)} />)}</div> : <div className="no-results"><h3>Tidak ada relic yang cocok.</h3><p>Coba nama lain atau hapus filter untuk melihat koleksi.</p><button onClick={resetFilters}>Tampilkan semua relic</button></div>}
          </section>
        </div>
        <aside className="detail-panel" aria-label="Relic terpilih"><RelicDetails relic={selected} position={selectedPosition} /></aside>
      </div> : <div className="empty-workspace">
        <section className="empty-demo" aria-labelledby="empty-heading"><div className="empty-art" aria-hidden="true">{['117_0.png','117_2.png','117_3.png'].map(file => <GameImage key={file} file={file} alt="" />)}</div><h2 id="empty-heading">Mulai dengan melihat demo</h2><p>Jelajahi equipment Acheron dengan delapan relic sintetis. Demo tidak terhubung ke akun game.</p><button className="primary" onClick={toggleDemo}>Jelajahi demo</button><p className="fineprint">Import JSON belum tersedia.</p></section>
        <section className="preparation-panel" aria-label="Menyiapkan inventory"><ScannerGuide /></section>
      </div>}
    </main>
    <footer className="app-footer"><span>Orbit / Workspace relic lokal</span><div><a href="https://github.com/darelaj/orbit" target="_blank" rel="noreferrer">Source Orbit</a><a href="https://github.com/darelaj/orbit/blob/main/docs/ASSETS.md" target="_blank" rel="noreferrer">Kredit aset &amp; font</a></div></footer>
    <dialog ref={guide} className="guide-dialog" aria-labelledby="guide-heading"><div className="dialog-header"><h2 id="guide-heading">Panduan scanner</h2><button onClick={() => guide.current?.close()} aria-label="Tutup panduan">Tutup</button></div><ScannerGuide /></dialog>
    <dialog ref={detail} className="detail-dialog" aria-label="Detail relic terpilih"><div className="dialog-header"><button onClick={() => detail.current?.close()}>Kembali ke koleksi</button><span className="demo-label">Demo sintetis</span></div><RelicDetails relic={selected} position={selectedPosition} /></dialog>
  </div>;
}
