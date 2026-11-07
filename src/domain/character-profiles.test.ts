import { expect, test } from 'vitest';
import fixture from '../../tests/fixtures/character-export.json';
import { parseInventory } from './inventory';
import { calculateBuild } from './comparison';
import { resolveCharacterProfile } from './character-profiles';
import { decodeComparisons, encodeComparisons } from '../storage/comparison';

function inventory(id = '1308', path = 'Nihility') {
  const raw = structuredClone(fixture);
  const character = { ...raw.characters[0], id, path, traces: { ...raw.characters[0].traces } };
  for (const key of Object.keys(character.traces)) if (key !== 'secret') Reflect.set(character.traces, key, key !== 'special');
  return parseInventory(JSON.stringify({ ...raw, characters: [character], light_cones: [{ id: '20000', name: 'Arrows', _uid: 'arrows', location: id, level: 80, ascension: 6, superimposition: 1 }] }));
}
const options = { baselineKit: true, lightCone: 'none' };

test('reviewed character growth and anchor-mapped minor Traces match independent totals', () => {
  const acheron = resolveCharacterProfile(inventory(), '1308', options).profile!;
  expect(acheron.base.HP).toBeCloseTo(1125.432, 8);
  expect(acheron.base.ATK).toBeCloseTo(698.544, 8);
  expect(acheron.base.DEF).toBeCloseTo(436.59, 8);
  expect(acheron.base.SPD).toBe(101);
  expect(acheron.corrections['ATK_']).toBeCloseTo(28);
  expect(acheron.corrections['CRIT DMG_']).toBeCloseTo(74);
  expect(acheron.corrections['Lightning DMG Boost_']).toBeCloseTo(8);
  expect(acheron.corrections['CRIT Rate_']).toBe(5);
  expect(acheron.corrections['Energy Regeneration Rate_']).toBe(100);
  expect(calculateBuild(acheron, {}).totals.ATK).toBeCloseTo(894.13632, 7);
  const march = resolveCharacterProfile(inventory('1001', 'Preservation'), '1001', options).profile!;
  expect(march.base.HP).toBeCloseTo(1058.4);
  expect(march.base.DEF).toBeCloseTo(573.3);
  expect(march.corrections['DEF_']).toBeCloseTo(22.5);
  expect(march.corrections['Ice DMG Boost_']).toBeCloseTo(22.4);
  const bronya = resolveCharacterProfile(inventory('1101', 'Harmony'), '1101', options).profile!;
  expect(bronya.base.SPD).toBe(99);
  expect(bronya.base.HP).toBeCloseTo(1241.856);
  expect(bronya.corrections['CRIT DMG_']).toBeCloseTo(74);
});

test('low-level boundaries, explicit Light Cone choice and Path mismatch retain correct base math', () => {
  const inv = inventory(); const p = inv.characters[0].progression!;
  p.level = 1; p.ascension = 0;
  for (const key of Object.keys(p.traces!)) Reflect.set(p.traces!, key, false);
  p.traces!.stat_1 = true;
  inv.lightCones[0].level = 1; inv.lightCones[0].ascension = 0;
  const profile = resolveCharacterProfile(inv, '1308', { baselineKit: true, lightCone: 'equipped' }).profile!;
  expect(profile.base.HP).toBe(153.12);
  expect(profile.corrections['ATK_']).toBe(4);
  expect(profile.corrections['CRIT DMG_']).toBe(50);
  expect(profile.cone).toEqual({ HP: 38.4, ATK: 14.4, DEF: 12 });
  expect(profile.origin?.notes.join(' ')).toContain('Path mismatch');
  inv.lightCones[0].superimposition = 5;
  expect(resolveCharacterProfile(inv, '1308', { baselineKit: true, lightCone: 'equipped' }).profile!.cone).toEqual(profile.cone);
  p.level = 20; p.ascension = 1;
  expect(resolveCharacterProfile(inv, '1308', options).profile?.base.HP).toBeCloseTo(359.832);
});

test('missing/unsupported/unresolved data never becomes a zero-filled automatic profile', () => {
  const failures = [
    (inv: ReturnType<typeof inventory>) => { inv.characters[0].progression = undefined; },
    (inv: ReturnType<typeof inventory>) => { inv.characters[0].id = 'unknown'; },
    (inv: ReturnType<typeof inventory>) => { inv.characters[0].progression!.path = 'Other'; },
    (inv: ReturnType<typeof inventory>) => { inv.characters[0].progression!.level = 0; },
    (inv: ReturnType<typeof inventory>) => { inv.characters[0].progression!.ascension = 1; },
    (inv: ReturnType<typeof inventory>) => { inv.characters[0].progression!.traces!.ability_1 = false; },
    (inv: ReturnType<typeof inventory>) => { inv.characters[0].progression!.traces!.special = true; },
  ];
  for (const change of failures) { const inv = inventory(); change(inv); const result = resolveCharacterProfile(inv, '1308', options); expect(result.profile).toBeNull(); expect(result.issues.length).toBeGreaterThan(0); }
  expect(resolveCharacterProfile(inventory(), '1308', { ...options, baselineKit: false }).issues[0]).toContain('Confirm');
  const inv = inventory(); inv.lightCones.push({ ...inv.lightCones[0], uid: 'duplicate-owner' });
  expect(resolveCharacterProfile(inv, '1308', { ...options, lightCone: 'equipped' }).issues[0]).toContain('ambiguous');
  expect(resolveCharacterProfile(inv, '1308', { ...options, lightCone: 'arrows' }).profile).not.toBeNull();
  inv.lightCones[0].level = undefined;
  expect(resolveCharacterProfile(inv, '1308', { ...options, lightCone: 'arrows' }).profile).toBeNull();
});

test('snapshot identity preserves profile source and explicit edits, while legacy snapshots still decode', () => {
  const inv = inventory();
  const profile = resolveCharacterProfile(inv, '1308', options).profile!;
  const pair = { name: 'Baseline fixture', profile, a: {}, b: {}, precision: 'packet' as const };
  expect(decodeComparisons(encodeComparisons([pair]))[0].profile).toEqual(profile);
  const key = profile.origin!.key;
  inv.characters[0].progression!.eidolon = 1;
  expect(resolveCharacterProfile(inv, '1308', options).profile!.origin!.key).not.toBe(key);
  profile.origin!.mode = 'edited';
  expect(decodeComparisons(encodeComparisons([pair]))[0].profile.origin?.mode).toBe('edited');
  const legacy = { ...profile }; delete legacy.origin;
  expect(decodeComparisons(encodeComparisons([{ ...pair, profile: legacy }]))[0].profile.origin).toBeUndefined();
  const bad = JSON.parse(encodeComparisons([pair]));
  // Reject source metadata independently from the still-valid numerical profile.
  bad.items[0].profile.origin.cataloguePin = 'unknown';
  expect(() => decodeComparisons(JSON.stringify(bad))).toThrow();
});
