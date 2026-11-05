import { demoRelics, slots, slotNames, type DemoRelic, type Slot } from './demo';
import { FigmaIcon, GameImage } from './Equipment';

export type LockFilter = 'all' | 'locked' | 'unlocked';
export type SortOrder = 'equipped' | 'slot' | 'slot-reverse';

export function CharacterEquipment({ selectedId, onSelect }: { selectedId: string; onSelect: (relic: DemoRelic) => void }) {
  return <section className="character-equipment" aria-labelledby="character-name">
    <div className="character-banner">
      <div className="character-art"><GameImage file="1308.png" alt="Artwork Acheron untuk konteks equipment demo" character /></div>
      <div className="character-identity"><p className="eyebrow">Konteks perlengkapan</p><h2 id="character-name">Acheron</h2><p>6 relic terpasang <span>· Koleksi demo</span></p></div>
    </div>
    <div className="loadout-slots" role="group" aria-label="Equipment Acheron demo">{slots.map(slot => {
      const relic = demoRelics.find(item => item.slot === slot && item.equipped)!;
      const selected = relic.id === selectedId;
      return <button key={slot} onClick={() => onSelect(relic)} aria-label={`Lihat equipment ${slotNames[slot]}`} aria-pressed={selected}>
        <GameImage file={relic.image} alt="" /><span className="slot-full">{slotNames[slot]}</span><span className="slot-short">{slot}</span><small>{selected ? 'Dipilih' : '+15 · Terpasang'}</small>
      </button>;
    })}</div>
  </section>;
}

type FiltersProps = {
  query: string; onQuery: (value: string) => void;
  slot: Slot | 'Semua'; onSlot: (value: Slot | 'Semua') => void;
  lockFilter: LockFilter; onLock: (value: LockFilter) => void;
  sortOrder: SortOrder; onSort: (value: SortOrder) => void;
  onReset: () => void; hasFilters: boolean;
};

export function InventoryFilters(props: FiltersProps) {
  return <div className="filter-fields">
    <label className="search-field"><span>Cari relic</span><span className="search-control"><FigmaIcon name="search" /><input type="search" placeholder="Nama, set, atau main stat" value={props.query} onChange={event => props.onQuery(event.target.value)} /></span></label>
    <label className="slot-field"><span>Slot</span><select value={props.slot} onChange={event => props.onSlot(event.target.value as Slot | 'Semua')}><option value="Semua">Semua slot</option>{slots.map(slot => <option key={slot} value={slot}>{slotNames[slot]}</option>)}</select></label>
    <label className="lock-field"><span>Status kunci</span><select value={props.lockFilter} onChange={event => props.onLock(event.target.value as LockFilter)}><option value="all">Semua status</option><option value="locked">Terkunci</option><option value="unlocked">Tidak terkunci</option></select></label>
    <label className="sort-field"><span>Urutan</span><select value={props.sortOrder} onChange={event => props.onSort(event.target.value as SortOrder)}><option value="equipped">Terpasang dulu</option><option value="slot">Slot: Head ke Rope</option><option value="slot-reverse">Slot: Rope ke Head</option></select></label>
    <button className="reset-button" onClick={props.onReset} disabled={!props.hasFilters}>Reset filter</button>
  </div>;
}

export function ScannerGuide() {
  return <div className="scanner-guide">
    <h2>Dari scanner ke file lokal</h2>
    <p>Untuk seluruh relic, termasuk yang tersimpan, siapkan ekspor JSON dari scanner PC. UID Enka hanya menyediakan showcase publik.</p>
    <div className="scanner-links"><a href="https://github.com/IceDynamix/reliquary-archiver" target="_blank" rel="noreferrer"><strong>Reliquary Archiver</strong><span>Petunjuk ekspor inventory</span></a><a href="https://github.com/kel-z/HSR-Scanner" target="_blank" rel="noreferrer"><strong>Kel-Z HSR Scanner</strong><span>Petunjuk scanner di PC</span></a></div>
    <p className="guide-limitation">Import JSON sedang dikembangkan. Saat ini Orbit menyediakan demo untuk mencoba koleksi, filter, dan detail relic.</p>
    <p className="fineprint">Ekspor OCR tidak menyimpan desimal SPD tersembunyi. Perbandingan build, optimizer, dan speed tuning belum tersedia.</p>
  </div>;
}
