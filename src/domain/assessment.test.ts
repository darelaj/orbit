import { expect, test } from 'vitest';
import { assessEquipment, assessTargets, assessCurrentBuild, assessCandidate, classifySearch } from './assessment';
import { equippedLoadout, type BuildProfile, type Loadout } from './comparison';
import { resolveCharacterProfile } from './character-profiles';
import characterExport from '../../tests/fixtures/character-export.json';
import { inventorySlots, parseInventory } from './inventory';
import { defaultOptions, runSearch } from './optimizer';

const profile: BuildProfile = { name: 'Synthetic assessment', base: { HP: 1000, ATK: 500, DEF: 400, SPD: 100 }, cone: { HP: 0, ATK: 0, DEF: 0 }, corrections: { 'CRIT Rate_': 5, 'CRIT DMG_': 50 } };
const relics = parseInventory(JSON.stringify({ source: 'HSR-Scanner', version: 4, relics: inventorySlots.map((slot, i) => ({ _uid: `assessment_${i}`, set_id: i < 4 ? '101' : '301', name: 'Synthetic', slot, rarity: 5, level: 0, mainstat: i === 1 ? 'ATK' : 'HP', substats: [], location: '', lock: false, discard: false })) })).relics;
const loadout: Loadout = Object.fromEntries(relics.map(r => [r.slot, r]));
const totals = assessCurrentBuild(profile, loadout, {}).build!.totals;
const search = (options = defaultOptions, pool = relics) => runSearch({ profile, relics: pool, options });

test('equipment distinguishes empty, partial and complete without filling missing slots', () => {
  expect(assessEquipment({})).toMatchObject({ filledCount: 0, complete: false });
  const partial = assessEquipment({ Head: loadout.Head, Hands: loadout.Hands });
  expect(partial.filledCount).toBe(2);
  expect(partial.complete).toBe(false);
  expect(partial.slots.filter(s => !s.filled).map(s => s.slot)).toEqual(['Body', 'Feet', 'Planar Sphere', 'Link Rope']);
  expect(assessEquipment(loadout)).toMatchObject({ filledCount: 6, complete: true });
});

test('targets preserve precise signed gaps and inclusive min/max boundaries', () => {
  const options = { goal: 'targets' as const, minimums: { SPD: 134, 'CRIT DMG_': 190 }, maximums: { SPD: 145 } };
  const below = assessTargets({ ...totals, SPD: 133.9, 'CRIT DMG_': 180 }, options);
  expect(below.status).toBe('below');
  expect(below.gaps.find(g => g.stat === 'SPD')).toMatchObject({ actual: 133.9, minimum: 134, maximum: 145, met: false });
  expect(below.gaps.find(g => g.stat === 'SPD')!.gap).toBeCloseTo(-0.1);
  expect(below.gaps.find(g => g.stat === 'CRIT DMG_')!.gap).toBe(-10);
  for (const SPD of [134, 145]) {
    const met = assessTargets({ ...totals, SPD, 'CRIT DMG_': 190 }, options);
    expect(met.status).toBe('met');
    expect(met.gaps.every(g => g.met && g.gap === 0)).toBe(true);
  }
  const above = assessTargets({ ...totals, SPD: 150, 'CRIT DMG_': 190 }, options);
  expect(above.status).toBe('below');
  expect(above.gaps.find(g => g.stat === 'SPD')!.gap).toBe(5);
});

test('absent targets, absent totals and legacy SPD aliases remain distinct', () => {
  expect(assessTargets(totals, {}).status).toBe('no-targets');
  expect(assessTargets(null, {}).status).toBe('profile-incomplete');
  expect(assessTargets(totals, { minimums: { SPD: undefined } }).status).toBe('no-targets');
  expect(assessTargets({ ...totals, SPD: 134 }, { minSPD: 134, maxSPD: 134 }).status).toBe('met');
});

test('assessment and search share validation instead of relaxing invalid targets', () => {
  const invalid = [
    { goal: 'targets' as const }, { minimums: { SPD: NaN } }, { maximums: { SPD: Infinity } },
    { minimums: { SPD: -1 } }, { minimums: { SPD: 145 }, maximums: { SPD: 134 } },
    { minSPD: 134, minimums: { SPD: 134 } },
  ];
  for (const options of invalid) {
    expect(() => assessTargets(totals, options)).toThrow();
    expect(() => assessTargets(null, options)).toThrow();
    expect(() => search({ ...defaultOptions, ...options })).toThrow();
  }
  expect(() => assessTargets({ ...totals, SPD: NaN }, { minSPD: 134 })).toThrow('nonfinite');
});

test('missing/invalid profiles stay incomplete and partial equipment retains modeled totals', () => {
  const missing = assessCurrentBuild(null, loadout, { minSPD: 134 });
  expect(missing.build).toBeNull();
  expect(missing.profileError).toContain('profile');
  expect(missing.targets.status).toBe('profile-incomplete');
  const invalid = assessCurrentBuild({ ...profile, base: { ...profile.base, SPD: 0 } }, {}, {});
  expect(invalid.build).toBeNull();
  expect(invalid.profileError).toContain('SPD');
  const partial = assessCurrentBuild(profile, { Hands: { ...loadout.Hands!, substats: [{ key: 'SPD', value: 33.9 }] } }, { minSPD: 134 });
  expect(partial.equipment.filledCount).toBe(1);
  expect(partial.build!.totals.ATK).toBeCloseTo(556.448);
  expect(partial.build!.totals.SPD).toBe(133.9);
  expect(partial.targets.status).toBe('below');
  expect(partial.warnings.filter(w => w.includes('empty slot'))).toHaveLength(5);
  expect(partial.profileError).toBeNull();
});

test('current build retains set activations, unknown-set disclosure and excess-CRIT warning', () => {
  const complete = assessCurrentBuild(profile, loadout, {});
  expect(complete.equipment.complete).toBe(true);
  expect(complete.build!.activeSets.map(s => [s.id, s.pieces])).toEqual([['101', 2], ['101', 4], ['301', 2]]);
  const unknown = assessCurrentBuild({ ...profile, corrections: { 'CRIT Rate_': 110 } }, { ...loadout, Head: { ...loadout.Head!, setId: 'future' } }, {});
  expect(unknown.warnings).toContain('Unknown set future: no bonus applied.');
  expect(unknown.warnings.some(w => w.includes('exceeds 100%'))).toBe(true);
  expect(() => assessCurrentBuild(profile, { Head: loadout.Hands }, {})).toThrow('Wrong relic slot');
});

test('same-profile candidate deltas match independent stat/CV expectations and ignore preview', () => {
  const current = { ...loadout, Hands: { ...loadout.Hands!, substats: [{ key: 'SPD', value: 33.9 }, { key: 'CRIT Rate_', value: 50 }, { key: 'CRIT DMG_', value: 100 }] } };
  const candidate = { ...loadout, Hands: { ...loadout.Hands!, id: 'upgrade', substats: [{ key: 'SPD', value: 34 }, { key: 'CRIT Rate_', value: 60 }, { key: 'CRIT DMG_', value: 120 }], preview: [{ key: 'SPD', value: 200 }], reroll: [{ key: 'CRIT DMG_', value: 300 }] } };
  const before = JSON.stringify({ profile, current, candidate });
  const delta = assessCandidate(profile, current, candidate, 'cv');
  expect(delta.currentScore).toBe(260);
  expect(delta.candidateScore).toBe(300);
  expect(delta.objectiveChange).toBe(40);
  expect(delta.stats.find(s => s.key === 'SPD')!.delta).toBeCloseTo(0.1);
  expect(delta.stats.find(s => s.key === 'CRIT DMG_')!.delta).toBe(20);
  expect(delta.changedSlots).toEqual(['Hands']);
  expect(delta.currentPartial).toBe(false);
  expect(JSON.stringify({ profile, current, candidate })).toBe(before);
  expect(assessCandidate(profile, candidate, current, 'cv').objectiveChange).toBe(-40);
});

test('deltas flag partial current builds, retain warnings and reject incomplete/invalid candidates', () => {
  const delta = assessCandidate(profile, {}, loadout, 'SPD');
  expect(delta.currentPartial).toBe(true);
  expect(delta.changedSlots).toEqual(inventorySlots);
  expect(delta.warnings.current).toHaveLength(6);
  expect(delta.warnings.candidate).toEqual([]);
  expect(assessCandidate(profile, loadout, loadout, 'ATK')).toMatchObject({ objectiveChange: 0, changedSlots: [] });
  expect(() => assessCandidate(profile, loadout, {}, 'cv')).toThrow('six equipment');
  expect(() => assessCandidate(profile, {}, { ...loadout, Head: loadout.Hands }, 'cv')).toThrow('Wrong relic slot');
});

test('completed exhaustive reports alone claim an optimum under the modeled pool', () => {
  expect(classifySearch(null)).toEqual({ kind: 'no-search' });
  const report = search();
  const status = classifySearch(report);
  expect(status.kind).toBe('exact-optimum');
  if (status.kind !== 'exact-optimum') throw new Error('Expected exact modeled optimum');
  expect(status.result).toBe(report.results[0]);
  expect(status.exclusions).toEqual([]);
  expect(classifySearch(search({ ...defaultOptions, minSPD: 1000 })).kind).toBe('no-feasible');
});

test('limited sampling never proves optimum or infeasibility', () => {
  const alternate = { ...loadout.Hands!, id: 'fast', substats: [{ key: 'SPD', value: 34 }] };
  const pool = [...relics, alternate];
  const options = { ...defaultOptions, mode: 'limited' as const, budget: 1 };
  expect(classifySearch(search(options, pool))).toMatchObject({ kind: 'best-found', exhaustive: false });
  expect(classifySearch(search({ ...options, minSPD: 134 }, pool))).toMatchObject({ kind: 'inconclusive', exhaustive: false });
  expect(classifySearch(search({ ...options, budget: 2 }, pool)).kind).toBe('exact-optimum');
});

test('excluded calculations remain explicit with and without a feasible result', () => {
  const bad = { ...loadout.Hands!, id: 'unsupported', substats: [{ key: 'FakeKey_', value: 10 }] };
  const report = search(defaultOptions, [...relics, bad]);
  expect(report.invalid).toBe(1);
  expect(classifySearch(report)).toMatchObject({ kind: 'best-found', exhaustive: true, exclusions: [expect.stringContaining('Unsupported substat')] });
  const invalidOnly = search(defaultOptions, relics.map(r => r.slot === 'Hands' ? bad : r));
  expect(invalidOnly.invalid).toBe(1);
  expect(classifySearch(invalidOnly)).toMatchObject({ kind: 'inconclusive', exhaustive: true, exclusions: [expect.stringContaining('Unsupported substat')] });
});

test('owned-character baseline flows through equipped review, search and same-profile upgrade', () => {
  const raw = structuredClone(characterExport);
  raw.characters[0].traces!.stat_2 = true;
  const inventory = parseInventory(JSON.stringify(raw));
  const resolved = resolveCharacterProfile(inventory, '1308', { baselineKit: true, lightCone: 'none' });
  expect(resolved.profile).not.toBeNull();
  const character = resolved.profile!;
  expect(character.base.SPD).toBe(101);
  const pool = relics.map(r => ({ ...r, location: r.slot === 'Hands' ? '' : '1308', substats: r.slot === 'Hands' ? [{ key: 'SPD', value: 34 }] : [] }));
  const current = equippedLoadout(pool, '1308');
  const options = { ...defaultOptions, goal: 'targets' as const, objective: 'CRIT DMG_' as const, minimums: { SPD: 134 } };
  const review = assessCurrentBuild(character, current, options);
  expect(review.equipment.filledCount).toBe(5);
  expect(review.targets.gaps[0]).toMatchObject({ actual: 101, gap: -33, met: false });
  const report = runSearch({ profile: character, relics: pool, options });
  expect(classifySearch(report).kind).toBe('exact-optimum');
  const candidate = report.results[0].loadout;
  expect(assessCurrentBuild(character, candidate, options).targets.status).toBe('met');
  const delta = assessCandidate(character, current, candidate, options.objective);
  expect(delta.currentPartial).toBe(true);
  expect(delta.changedSlots).toEqual(['Hands']);
  expect(delta.stats.find(s => s.key === 'SPD')).toMatchObject({ current: 101, candidate: 135, delta: 34 });
  expect(character.origin!.characterId).toBe('1308');
});
