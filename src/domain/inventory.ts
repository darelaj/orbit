export const inventorySlots = ['Head', 'Hands', 'Body', 'Feet', 'Planar Sphere', 'Link Rope'] as const;
export type InventorySlot = typeof inventorySlots[number];
export type Stat = { key: string; value: number };
export type InventoryRelic = {
  id: string; setId: string; setName: string; slot: InventorySlot;
  rarity: number; level: number; mainStat: string; substats: Stat[];
  preview: Stat[]; reroll: Stat[]; location: string; locked: boolean; discarded: boolean;
};
export type Inventory = {
  source: 'reliquary_archiver' | 'HSR-Scanner'; version: 4;
  precision: 'packet' | 'ocr'; relics: InventoryRelic[];
};
export const MAX_BYTES = 20 * 1024 * 1024;
export const MAX_RELICS = 10000;
const subKeys = ['HP', 'ATK', 'DEF', 'HP_', 'ATK_', 'DEF_', 'SPD', 'CRIT Rate_', 'CRIT DMG_', 'Effect Hit Rate_', 'Effect RES_', 'Break Effect_'];
const base = ['HP', 'ATK', 'DEF'];
const mainKeys: Record<InventorySlot, string[]> = {
  Head: ['HP'], Hands: ['ATK'], Body: [...base, 'CRIT Rate', 'CRIT DMG', 'Effect Hit Rate', 'Outgoing Healing Boost'],
  Feet: [...base, 'SPD'], 'Planar Sphere': [...base, ...['Physical', 'Fire', 'Ice', 'Lightning', 'Wind', 'Quantum', 'Imaginary'].map(x => `${x} DMG Boost`)],
  'Link Rope': [...base, 'Break Effect', 'Energy Regeneration Rate'],
};
function fail(path: string, message: string): never { throw new Error(`${path}: ${message}`); }
function record(value: unknown, path: string): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return fail(path, 'expected an object');
  return value as Record<string, unknown>;
}
function string(value: unknown, path: string, empty = false): string {
  if (typeof value !== 'string' || (!empty && !value.trim()) || value.length > 500) return fail(path, 'expected a string (maximum 500 characters)');
  return value;
}
function integer(value: unknown, path: string, min: number, max: number): number {
  if (typeof value !== 'number' || !Number.isInteger(value) || value < min || value > max) return fail(path, `expected an integer from ${min} to ${max}`);
  return value;
}
function boolean(value: unknown, path: string): boolean {
  if (typeof value !== 'boolean') return fail(path, 'expected true or false');
  return value;
}
function stats(value: unknown, path: string): Stat[] {
  if (!Array.isArray(value) || value.length > 4) return fail(path, 'expected up to four stats');
  const seen = new Set<string>();
  return value.map((raw, i) => {
    const p = `${path}[${i}]`; const r = record(raw, p); const key = string(r.key, `${p}.key`);
    if (!subKeys.includes(key) || seen.has(key)) return fail(`${p}.key`, 'unsupported or duplicate stat');
    seen.add(key);
    if (typeof r.value !== 'number' || !Number.isFinite(r.value) || r.value < 0) return fail(`${p}.value`, 'expected a finite nonnegative number');
    return { key, value: r.value };
  });
}
export function parseInventory(text: string): Inventory {
  if (new TextEncoder().encode(text).length > MAX_BYTES) return fail('File', 'maximum size is 20 MiB');
  let raw: unknown;
  try { raw = JSON.parse(text); } catch { return fail('File', 'invalid JSON'); }
  let root = record(raw, 'File');
  if (root.event === 'InitialScan') root = record(root.data, 'data');
  if (root.format === 'orbit-inventory') {
    if (root.schemaVersion !== 1) return fail('Backup', 'unsupported schema version');
    root = record(root.scanner, 'scanner');
  }
  if (root.source !== 'reliquary_archiver' && root.source !== 'HSR-Scanner') return fail('source', 'unsupported scanner');
  if (root.version !== 4) return fail('version', 'only scanner schema 4 is supported');
  if (!Array.isArray(root.relics) || root.relics.length > MAX_RELICS) return fail('relics', 'expected at most 10,000 relics');
  const ids = new Set<string>();
  const relics = root.relics.map((raw, i): InventoryRelic => {
    const p = `relics[${i}]`; const r = record(raw, p);
    const id = string(r._uid, `${p}._uid`);
    if (ids.has(id)) return fail(`${p}._uid`, `duplicate scanner ID ${id}`);
    ids.add(id);
    const slot = string(r.slot, `${p}.slot`);
    if (!inventorySlots.includes(slot as InventorySlot)) return fail(`${p}.slot`, 'unsupported slot');
    const validSlot = slot as InventorySlot;
    const rarity = integer(r.rarity, `${p}.rarity`, 2, 5);
    const mainStat = string(r.mainstat, `${p}.mainstat`);
    if (!mainKeys[validSlot].includes(mainStat)) return fail(`${p}.mainstat`, 'incompatible with slot');
    return { id, setId: string(r.set_id, `${p}.set_id`), setName: string(r.name, `${p}.name`), slot: validSlot,
      rarity, level: integer(r.level, `${p}.level`, 0, rarity * 3), mainStat,
      substats: stats(r.substats, `${p}.substats`), preview: stats(r.preview_substats ?? [], `${p}.preview_substats`),
      reroll: stats(r.reroll_substats ?? [], `${p}.reroll_substats`), location: string(r.location, `${p}.location`, true),
      locked: boolean(r.lock, `${p}.lock`), discarded: boolean(r.discard, `${p}.discard`) };
  });
  return { source: root.source, version: 4, precision: root.source === 'HSR-Scanner' ? 'ocr' : 'packet', relics };
}
export function backupInventory(inventory: Inventory): string {
  return JSON.stringify({ format: 'orbit-inventory', schemaVersion: 1, scanner: {
    source: inventory.source, version: inventory.version, relics: inventory.relics.map(r => ({
      _uid: r.id, set_id: r.setId, name: r.setName, slot: r.slot, rarity: r.rarity, level: r.level,
      mainstat: r.mainStat, substats: r.substats, preview_substats: r.preview, reroll_substats: r.reroll,
      location: r.location, lock: r.locked, discard: r.discarded,
    })),
  } }, null, 2);
}
