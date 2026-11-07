import { expect, test } from 'vitest';
import fixture from '../../tests/fixtures/character-export.json';
import { backupInventory, characterDataStatus, parseInventory } from './inventory';

test('scanner and InitialScan retain supplied roster, progression and equipped cone without leaking unrelated data', () => {
  for (const source of ['reliquary_archiver', 'HSR-Scanner']) {
    for (const envelope of [false, true]) {
      const raw = { ...fixture, source };
      const inventory = parseInventory(JSON.stringify(envelope ? { event: 'InitialScan', data: raw } : raw));
      expect(inventory.characters.map(c => c.id)).toEqual(['1308', '8007']);
      expect(inventory.relics.some(r => r.location === '8007')).toBe(false);
      expect(inventory.roster).toEqual({ source: 'supplied', completeness: 'unknown' });
      expect(inventory.lightConeSource).toBe('supplied');
      expect(inventory.characters[0].progression).toMatchObject({ path: 'Nihility', level: 80, ascension: 6, eidolon: 0, ability_version: 1, skills: { basic: 6 }, traces: { stat_2: false }, memosprite: { skill: 0 } });
      expect(characterDataStatus(inventory.characters[0])).toBe('unverified');
      expect(characterDataStatus(inventory.characters[1])).toBe('partial');
      expect(inventory.lightCones[0]).toMatchObject({ uid: 'cone-1', location: '1308', level: 80, ascension: 6, superimposition: 1 });
      expect(inventory.relics[0].substats[0].value).toBe(2.59999);
      const backup = backupInventory(inventory);
      expect(JSON.parse(backup).schemaVersion).toBe(2);
      expect(backup).not.toContain('drop-me');
      expect(parseInventory(backup)).toEqual(inventory);
    }
  }
});

test('legacy and omitted roster data remain unknown, never reconstructed from relic owners', () => {
  const scanner = { source: 'HSR-Scanner', version: 4, relics: fixture.relics };
  const omitted = parseInventory(JSON.stringify(scanner));
  expect(omitted.roster).toEqual({ source: 'omitted', completeness: 'unknown' });
  expect(omitted.characters).toEqual([]);
  expect(omitted.lightConeSource).toBe('omitted');
  expect(parseInventory(backupInventory(omitted))).toEqual(omitted);
  const empty = parseInventory(JSON.stringify({ ...scanner, characters: [] }));
  expect(empty.roster.source).toBe('supplied');
  const legacy = parseInventory(JSON.stringify({ format: 'orbit-inventory', schemaVersion: 1, scanner: { ...scanner, characters: [{ id: '1308', name: 'Legacy character' }] } }));
  expect(legacy.roster.source).toBe('legacy-backup');
  expect(legacy.lightConeSource).toBe('legacy-backup');
  expect(legacy.importedAt).toBeNull();
  expect(characterDataStatus(legacy.characters[0])).toBe('missing');
  expect(legacy.characters[0].progression).toBeUndefined();
  expect(parseInventory(backupInventory(legacy))).toEqual(legacy);
  const partial = parseInventory(JSON.stringify({ ...scanner, characters: [{ id: 'new-form', name: 'Unknown future form', level: 1, traces: { stat_1: false } }] }));
  expect(characterDataStatus(partial.characters[0])).toBe('partial');
  expect(partial.characters[0].progression?.eidolon).toBeUndefined();
});

test('invalid known progression fields reject the entire export with an actionable path', () => {
  const changes = [
    { level: 81 }, { level: -1 }, { level: 1.5 }, { path: '' }, { ascension: 7 }, { eidolon: 7 },
    { ability_version: '1' }, { skills: [] }, { skills: { basic: '6' } }, { skills: { ult: 101 } },
    { traces: { stat_1: 1 } }, { traces: null }, { memosprite: { skill: -1 } },
  ];
  for (const change of changes) expect(() => parseInventory(JSON.stringify({ ...fixture, characters: [fixture.characters[0], { ...fixture.characters[1], ...change }] }))).toThrow(/characters\[1\]/);
  for (const change of [{ level: 0 }, { superimposition: 6 }, { ascension: '6' }]) expect(() => parseInventory(JSON.stringify({ ...fixture, light_cones: [{ ...fixture.light_cones[0], ...change }] }))).toThrow(/light_cones\[0\]/);
  expect(() => parseInventory(JSON.stringify({ ...fixture, characters: [fixture.characters[0], fixture.characters[0]] }))).toThrow('duplicate reference');
});

test('schema-2 provenance cannot claim a verified complete roster or hide supplied characters', () => {
  const backup = JSON.parse(backupInventory(parseInventory(JSON.stringify(fixture))));
  for (const roster of [{ source: 'supplied', completeness: 'complete' }, { source: 'omitted', completeness: 'unknown' }, { source: 'other', completeness: 'unknown' }, null]) expect(() => parseInventory(JSON.stringify({ ...backup, roster }))).toThrow('roster');
  for (const lightConeSource of ['complete', 'omitted', null]) expect(() => parseInventory(JSON.stringify({ ...backup, lightConeSource }))).toThrow('lightConeSource');
  for (const key of ['characters', 'light_cones']) expect(() => parseInventory(JSON.stringify({ ...fixture, [key]: null }))).toThrow(key);
});
