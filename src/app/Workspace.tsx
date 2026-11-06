import { demoRelics, slots, slotNames, type DemoRelic, type Slot } from './demo';
import { FigmaIcon, GameImage } from './Equipment';

export type LockFilter = 'all' | 'locked' | 'unlocked';
export type SortOrder = 'equipped' | 'slot' | 'slot-reverse';

export function CharacterEquipment({ selectedId, onSelect }: { selectedId: string; onSelect: (relic: DemoRelic) => void }) {
  return <section className="character-equipment" aria-labelledby="character-name">
    <div className="character-banner">
      <div className="character-art"><GameImage file="1308.png" alt="Acheron artwork for the demo equipment" character /></div>
      <div className="character-identity"><p className="eyebrow">Equipment context</p><h2 id="character-name">Acheron</h2><p>6 equipped relics <span>· Demo collection</span></p></div>
    </div>
    <div className="loadout-slots" role="group" aria-label="Acheron demo equipment">{slots.map(slot => {
      const relic = demoRelics.find(item => item.slot === slot && item.equipped)!;
      const selected = relic.id === selectedId;
      return <button key={slot} onClick={() => onSelect(relic)} aria-label={`View ${slotNames[slot]} equipment`} aria-pressed={selected}>
        <GameImage file={relic.image} alt="" /><span className="slot-full">{slotNames[slot]}</span><span className="slot-short">{slot}</span><small>{selected ? 'Selected' : '+15 · Equipped'}</small>
      </button>;
    })}</div>
  </section>;
}

type FiltersProps = {
  query: string; onQuery: (value: string) => void;
  slot: Slot | 'all'; onSlot: (value: Slot | 'all') => void;
  lockFilter: LockFilter; onLock: (value: LockFilter) => void;
  sortOrder: SortOrder; onSort: (value: SortOrder) => void;
  onReset: () => void; hasFilters: boolean;
};

export function InventoryFilters(props: FiltersProps) {
  return <div className="filter-fields">
    <label className="search-field"><span>Search relics</span><span className="search-control"><FigmaIcon name="search" /><input type="search" placeholder="Name, set, or main stat" value={props.query} onChange={event => props.onQuery(event.target.value)} /></span></label>
    <label className="slot-field"><span>Slot</span><select value={props.slot} onChange={event => props.onSlot(event.target.value as Slot | 'all')}><option value="all">All slots</option>{slots.map(slot => <option key={slot} value={slot}>{slotNames[slot]}</option>)}</select></label>
    <label className="lock-field"><span>Lock status</span><select value={props.lockFilter} onChange={event => props.onLock(event.target.value as LockFilter)}><option value="all">All statuses</option><option value="locked">Locked</option><option value="unlocked">Unlocked</option></select></label>
    <label className="sort-field"><span>Sort by</span><select value={props.sortOrder} onChange={event => props.onSort(event.target.value as SortOrder)}><option value="equipped">Equipped first</option><option value="slot">Slot: Head to Rope</option><option value="slot-reverse">Slot: Rope to Head</option></select></label>
    <button className="reset-button" onClick={props.onReset} disabled={!props.hasFilters}>Reset filters</button>
  </div>;
}

export function ScannerGuide() {
  return <div className="scanner-guide">
    <h2>Read your full inventory</h2>
    <p>Run Orbit with npm.cmd start, then open Scan inventory from HSR above. Orbit manages the Windows reader and offers a preview before replacement. Start on the game's Click to Start screen; only the reader requests Administrator permission.</p>
    <p>You can also import a JSON export from the scanners below. An Enka UID only provides public showcase data.</p>
    <div className="scanner-links"><a href="https://github.com/IceDynamix/reliquary-archiver" target="_blank" rel="noreferrer"><strong>Reliquary Archiver</strong><span>Inventory export instructions</span></a><a href="https://github.com/kel-z/HSR-Scanner" target="_blank" rel="noreferrer"><strong>Kel-Z HSR Scanner</strong><span>PC scanner instructions</span></a></div>
    <p className="guide-limitation">Import a schema 4 Reliquary Archiver or Kel-Z JSON file using the inventory file picker. Review the count before replacing your inventory. Normalized inventory stays in this browser. Integrated scanning briefly creates a local export, then removes it. Download a backup before clearing browser data.</p>
    <p className="fineprint">OCR exports do not include hidden SPD decimals. Build comparison uses a manual profile. The optimizer uses that same profile. Speed tuning uses a fixed-speed, initial-advance-only AV model.</p>
  </div>;
}
