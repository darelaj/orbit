import { useEffect, useState } from 'react';
import { initialTheme, persistTheme } from './theme';

export default function App() {
  const [theme, setTheme] = useState(initialTheme);
  const [themeStored, setThemeStored] = useState(true);
  useEffect(() => { document.documentElement.dataset.theme = theme; }, [theme]);

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    setThemeStored(persistTheme(next));
  }

  return (
    <div className="app">
      <a className="skip-link" href="#main">Lewati navigasi</a>
      <header className="app-header">
        <a className="wordmark" href="#inventory">Orbit<span>HSR relic workspace</span></a>
        <div className="header-actions"><span className="local-label">Workspace lokal</span><button onClick={toggleTheme} aria-label={`Gunakan tema ${theme === 'dark' ? 'terang' : 'gelap'}`}>Tema {theme === 'dark' ? 'gelap' : 'terang'}</button></div>
      </header>
      <nav className="main-nav" aria-label="Workspace"><a href="#inventory" aria-current="page">Inventory</a></nav>
      <main id="main" tabIndex={-1}>
        {!themeStored ? <p className="notice warning" role="status">Tema berubah untuk sesi ini. Browser tidak mengizinkan penyimpanan preferensi.</p> : null}
        <div className="page-title"><div><h1>Inventory relic</h1><p>Seluruh relic yang dipakai dan tersimpan, dalam satu workspace.</p></div></div>
        <section className="empty-state" aria-labelledby="empty-heading"><p className="section-label">Belum ada inventory</p><h2 id="empty-heading">Mulai dari ekspor scanner.</h2><p>Orbit akan membaca JSON dari Reliquary Archiver atau Kel-Z HSR Scanner. Data akun tidak disertakan dalam proyek ini.</p><a href="https://github.com/IceDynamix/reliquary-archiver" target="_blank" rel="noreferrer">Petunjuk ekspor Reliquary Archiver</a></section>
      </main>
      <footer className="app-footer"><span>Inventory diproses di browser pada perangkat ini.</span><a href="https://github.com/darelaj/orbit" target="_blank" rel="noreferrer">Source Orbit</a></footer>
    </div>
  );
}
