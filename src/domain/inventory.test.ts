import { expect, test } from 'vitest';
import { backupInventory, MAX_RELICS, parseInventory } from './inventory';

export const relicFixture = { _uid: '1', set_id: '102', name: 'Musketeer of Wild Wheat', slot: 'Hands', rarity: 5, level: 15, mainstat: 'ATK', substats: [{ key: 'SPD', value: 2.59999 }], preview_substats: [{ key: 'HP', value: 38 }], reroll_substats: [{ key: 'SPD', value: 6.1 }], location: '', lock: false, discard: true };
export const scannerFixture = { source: 'reliquary_archiver', version: 4, relics: [relicFixture] };
test('schema-derived exports preserve all items, precision and alternative rolls', () => {
  for (const source of ['reliquary_archiver', 'HSR-Scanner']) {
    const result = parseInventory(JSON.stringify({ ...scannerFixture, source, relics: [relicFixture, { ...relicFixture, _uid: '2', location: '1308', lock: true }] }));
    expect(result.relics).toHaveLength(2);
    expect(result.relics[0].substats[0].value).toBe(2.59999);
    expect(result.relics[0].preview[0].key).toBe('HP');
    expect(result.relics[0].reroll[0].value).toBe(6.1);
    expect(result.relics[0].discarded).toBe(true);
    expect(result.precision).toBe(source === 'HSR-Scanner' ? 'ocr' : 'packet');
    expect(parseInventory(backupInventory(result))).toEqual(result);
  }
});
test('InitialScan is supported without accepting other events or unknown versions', () => {
  expect(parseInventory(JSON.stringify({ event: 'InitialScan', data: scannerFixture })).relics).toHaveLength(1);
  for (const raw of [{ ...scannerFixture, source: 'Enka' }, { ...scannerFixture, version: 5 }, { event: 'UpdateRelics', data: scannerFixture }, { format: 'orbit-inventory', schemaVersion: 2 }]) expect(() => parseInventory(JSON.stringify(raw))).toThrow();
});
test('invalid records identify their path and never silently skip or deduplicate', () => {
  for (const change of [{ level: 16 }, { rarity: 1 }, { mainstat: 'SPD' }, { lock: 'false' }, { slot: 'Unknown' }, { substats: [{ key: 'unknown', value: 1 }] }, { substats: [{ key: 'SPD', value: -1 }] }]) {
    expect(() => parseInventory(JSON.stringify({ ...scannerFixture, relics: [relicFixture, { ...relicFixture, _uid: '2', ...change }] }))).toThrow(/relics\[1\]/);
  }
  expect(() => parseInventory(JSON.stringify({ ...scannerFixture, relics: [relicFixture, relicFixture] }))).toThrow('duplicate scanner ID');
  expect(() => parseInventory('{')).toThrow('invalid JSON');
  expect(() => parseInventory(JSON.stringify({ ...scannerFixture, relics: Array(MAX_RELICS + 1).fill(relicFixture) }))).toThrow('10,000');
  expect(() => parseInventory(' '.repeat(20 * 1024 * 1024 + 1))).toThrow('20 MiB');
});
