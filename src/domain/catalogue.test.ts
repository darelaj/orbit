import { expect, test } from 'vitest';
import { mainStatValue, catalogueItem } from './catalogue';
import type { InventoryRelic } from './inventory';
const item: InventoryRelic = { id: '1', setId: '102', setName: 'Musketeer', slot: 'Head', rarity: 5, level: 0, mainStat: 'HP', substats: [], preview: [], reroll: [], location: '', locked: false, discarded: false };
test('main stats use catalogue base plus level increments with units converted once', () => {
  expect(mainStatValue(item)?.value).toBeCloseTo(112.896);
  expect(mainStatValue({ ...item, level: 15 })?.value).toBeCloseTo(705.6, 2);
  expect(mainStatValue({ ...item, slot: 'Body', mainStat: 'CRIT Rate', level: 15 })?.value).toBeCloseTo(32.4, 2);
  expect(mainStatValue({ ...item, slot: 'Feet', mainStat: 'SPD', level: 15 })?.value).toBeCloseTo(25.032);
  expect(mainStatValue({ ...item, slot: 'Body', mainStat: 'Unknown' })).toBeUndefined();
  expect(mainStatValue({ ...item, rarity: 1 })).toBeUndefined();
});
test('catalogue resolves set/slot identity and leaves unknown sets unresolved', () => {
  expect(catalogueItem(item)?.icon).toBe('102_0.png');
  expect(catalogueItem({ ...item, setId: 'future' })).toBeUndefined();
});
