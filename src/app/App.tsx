import { useLayoutEffect, useRef, useState } from 'react';
import { initialTheme, persistTheme } from './theme';
import { demoRelics, slots, type DemoRelic, type Slot } from './demo';
import { GameImage, RelicCard, RelicDetails } from './Equipment';

export default function App() {
  const [theme, setTheme] = useState(initialTheme);
  const [themeStored, setThemeStored] = useState(true);
  const [demo, setDemo] = useState(true);
  const [slot, setSlot] = useState<Slot | 'Semua'>('Semua');
  const [query, setQuery] = useState('');
  const [onlyLocked, setOnlyLocked] = useState(false);
  const [selectedId, setSelectedId] = useState('demo-feet-01');
  const guide = useRef<HTMLDialogElement>(null);
  const detail = useRef<HTMLDialogElement>(null);
  useLayoutEffect(() => { document.documentElement.dataset.theme = theme; }, [theme]);

  const selected = demo ? demoRelics.find(relic => relic.id === selectedId) : undefined;
  const search = query.trim().toLowerCase();
  const visibleRelics = demo ? demoRelics.filter(relic => (slot === 'Semua' || relic.slot === slot) && (!onlyLocked || relic.locked) && `${relic.name} ${relic.set} ${relic.main[0]}`.toLowerCase().includes(search)) : [];
  const hasFilters = slot !== 'Semua' || query !== '' || onlyLocked;

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next); setThemeStored(persistTheme(next));
  }
  function resetFilters() { setSlot('Semua'); setQuery(''); setOnlyLocked(false); }
  function selectRelic(relic: DemoRelic) {
    setSelectedId(relic.id);
    if (globalThis.matchMedia?.('(max-width: 1199px)').matches) detail.current?.showModal();
  }
  function selectSlot(next: Slot) {
    resetFilters(); setSlot(next);
    const equipped = demoRelics.find(relic => relic.slot === next && relic.equipped);
    if (equipped) selectRelic(equipped);
  }
  function toggleDemo() { setDemo(!demo); resetFilters(); setSelectedId('demo-feet-01'); }

  return (
    <div className="app">
      <a className="skip-link" href="#main">Lewati navigasi</a>
      <header className="app-header">
        <a className="wordmark" href="#inventory" aria-label="Orbit, inventory relic">Orbit<span>Honkai: Star Rail</span></a>
        <nav className="main-nav" aria-label="Workspace"><a href="#inventory" aria-current="page">Inventory relic</a><button onClick={() => guide.current?.showModal()}>Panduan scanner</button></nav>
        <div className="header-actions"><span className="local-label">Workspace lokal</span><button className="theme-toggle" onClick={toggleTheme} aria-label={`Gunakan tema ${theme === 'dark' ? 'terang' : 'gelap'}`}><span aria-hidden="true">{theme === 'dark' ? '◐' : '◑'}</span><span>Tema {theme === 'dark' ? 'gelap' : 'terang'}</span></button></div>
      </header>
      <main id="main" tabIndex={-1}>
        {!themeStored ? <p className="notice" role="status">Tema berubah untuk sesi ini. Browser tidak mengizinkan penyimpanan preferensi.</p> : null}
        <div className="page-heading" id="inventory"><div><p className="section-caption">Equipment workspace</p><h1>Inventory relic<span>.</span></h1><p>Telusuri slot, periksa main stat dan substat.</p></div><button className={demo ? 'quiet-button' : 'primary'} onClick={toggleDemo}>{demo ? 'Keluar demo' : 'Jelajahi demo'}</button></div>
        <div className="inventory-context"><span className="context-label">{demo ? 'Demo sintetis' : 'Inventory kosong'}</span><span>{demo ? `${demoRelics.length} relic contoh · tidak disimpan` : 'Belum ada data akun'}</span><span className="context-note">{demo ? 'Bukan inventory akun kamu' : 'Import JSON sedang dikembangkan'}</span></div>
        {demo ? (
          <div className="equipment-workspace">
            <section className="character-panel" aria-labelledby="character-name">
              <div className="character-caption"><span className="section-caption">Konteks equipment</span><span>Karakter demo</span></div>
              <div className="character-art"><GameImage file="1308.png" alt="Artwork Acheron untuk konteks equipment demo" character /></div>
              <div className="character-identity"><p>Lightning / Nihility</p><h2 id="character-name">Acheron</h2><span>Loadout contoh · 6 slot</span></div>
              <div className="loadout-slots" role="group" aria-label="Slot equipment Acheron demo">{slots.map(item => {
                const equipped = demoRelics.find(relic => relic.slot === item && relic.equipped)!;
                return <button key={item} aria-label={`Lihat slot ${item}`} aria-pressed={slot === item} onClick={() => selectSlot(item)}><GameImage file={equipped.image} alt="" /><span>{item}</span></button>;
              })}</div>
              <p className="character-footnote">Pilih slot untuk menelusuri relic sejenis.</p>
            </section>
            <section className="inventory-panel" aria-labelledby="collection-heading">
              <div className="collection-heading"><h2 id="collection-heading">Koleksi relic</h2><span aria-live="polite" role="status">{visibleRelics.length} dari {demoRelics.length} relic</span></div>
              <div className="filter-fields"><label className="search-field"><span>Cari relic</span><input type="search" placeholder="Nama, set, atau main stat" value={query} onChange={event => setQuery(event.target.value)} /></label><label className="slot-field"><span>Slot</span><select value={slot} onChange={event => setSlot(event.target.value as Slot | 'Semua')}><option value="Semua">Semua slot</option>{slots.map(item => <option key={item} value={item}>{item}</option>)}</select></label></div>
              <div className="filter-options"><label><input type="checkbox" checked={onlyLocked} onChange={event => setOnlyLocked(event.target.checked)} />Hanya terkunci</label><button onClick={resetFilters} disabled={!hasFilters}>Reset filter</button></div>
              {visibleRelics.length > 0 ? <div className="relic-grid" aria-label="Hasil relic">{visibleRelics.map(relic => <RelicCard key={relic.id} relic={relic} selected={selectedId === relic.id} onSelect={() => selectRelic(relic)} />)}</div> : <div className="no-results"><h3>Tidak ada relic yang cocok.</h3><p>Coba nama lain atau reset filter untuk melihat seluruh demo.</p><button onClick={resetFilters}>Tampilkan semua relic</button></div>}
            </section>
            <aside className="detail-panel" aria-label="Relic terpilih"><RelicDetails relic={selected} /></aside>
          </div>
        ) : (
          <section className="empty-workspace" aria-labelledby="empty-heading"><div className="empty-slots" aria-label="Enam slot equipment">{slots.map((item, index) => <div key={item}><span>0{index + 1}</span><strong>{item}</strong></div>)}</div><div className="empty-copy"><p className="section-caption">Workspace kamu</p><h2 id="empty-heading">Inventory kamu<br />belum terisi.</h2><p>Mulai dengan menyiapkan ekspor inventory dari scanner. Import JSON belum tersedia; jelajahi demo untuk mencoba tampilan dan detail relic.</p><div className="empty-actions"><button className="primary" onClick={toggleDemo}>Jelajahi demo</button><button onClick={() => guide.current?.showModal()}>Cara menyiapkan ekspor</button></div></div></section>
        )}
      </main>
      <footer className="app-footer"><span>Orbit / Local relic workspace<span className="footer-separator">·</span>Demo tidak menggunakan data akun.</span><div><a href="https://github.com/darelaj/orbit" target="_blank" rel="noreferrer">Source Orbit</a><a href="https://github.com/Mar-7th/StarRailRes" target="_blank" rel="noreferrer">Aset HSR © HoYoverse / StarRailRes</a></div></footer>
      <dialog ref={guide} className="guide-dialog" aria-labelledby="guide-heading">
        <div className="dialog-header"><span className="section-caption">Menyiapkan inventory</span><button onClick={() => guide.current?.close()} aria-label="Tutup panduan">Tutup</button></div>
        <h2 id="guide-heading">Dari scanner ke workspace.</h2><p>UID Enka hanya menyediakan showcase publik. Untuk seluruh relic, termasuk yang tidak dipakai, siapkan ekspor JSON dari scanner.</p>
        <div className="scanner-options"><a href="https://github.com/IceDynamix/reliquary-archiver" target="_blank" rel="noreferrer"><strong>Reliquary Archiver</strong><span>Lihat petunjuk dan format ekspor</span></a><a href="https://github.com/kel-z/HSR-Scanner" target="_blank" rel="noreferrer"><strong>Kel-Z HSR Scanner</strong><span>Lihat petunjuk pemindaian di PC</span></a></div>
        <p className="guide-limitation">Import file sedang dikembangkan. Saat ini kamu bisa mencoba pencarian, filter, dan detail pada demo sintetis. Perbandingan build, optimizer, dan speed tuning menyusul.</p><p className="fineprint">Ekspor berbasis OCR tidak menyimpan desimal SPD tersembunyi. Demo ini tidak menghitung stat build atau damage.</p>
      </dialog>
      <dialog ref={detail} className="detail-dialog" aria-label="Detail relic terpilih"><div className="dialog-header"><span className="section-caption">Equipment</span><button onClick={() => detail.current?.close()}>Tutup detail</button></div><RelicDetails relic={selected} /></dialog>
    </div>
  );
}
