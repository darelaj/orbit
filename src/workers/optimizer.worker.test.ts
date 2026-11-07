import { expect, test, vi } from 'vitest';
import { inventorySlots, parseInventory } from '../domain/inventory';
import { defaultOptions, type SearchInput } from '../domain/optimizer';
import type { SearchRequest, SearchResponse } from './optimizer.protocol';

test('actual worker handler carries target/CV requests, bounded progress/results and validation errors', async () => {
  const posted: SearchResponse[] = [];
  const scope = { onmessage: null as ((event: MessageEvent<SearchRequest>) => void) | null, postMessage: (message: SearchResponse) => posted.push(structuredClone(message)) };
  vi.stubGlobal('self', scope);
  try {
    await import('./optimizer.worker');
    const relics = parseInventory(JSON.stringify({ source: 'HSR-Scanner', version: 4, relics: inventorySlots.flatMap((slot, i) => [0, 1, 2, 3].map(n => ({ _uid: `${i}_${n}`, slot, set_id: i < 4 ? '101' : '301', name: 'Synthetic', rarity: 5, level: n, mainstat: i === 1 ? 'ATK' : 'HP', substats: i === 1 ? [{ key: 'CRIT Rate_', value: n }] : [], location: '', lock: false, discard: false }))) })).relics;
    const input: SearchInput = { profile: { name: 'Worker fixture', base: { HP: 1000, ATK: 500, DEF: 400, SPD: 100 }, cone: { HP: 0, ATK: 0, DEF: 0 }, corrections: { 'CRIT Rate_': 70, 'CRIT DMG_': 140 } }, relics, options: { ...defaultOptions, budget: 5000, goal: 'targets', objective: 'cv', minimums: { 'CRIT DMG_': 140 }, maximums: { SPD: 100 } } };
    const original = JSON.stringify(input);
    scope.onmessage!(new MessageEvent('message', { data: structuredClone({ runId: 11, revision: 2, input }) }));
    expect(posted.every(m => m.runId === 11 && m.revision === 2)).toBe(true);
    expect(posted.filter(m => m.kind === 'progress')).toHaveLength(4);
    const complete = posted.at(-1);
    expect(complete?.kind).toBe('complete');
    if (complete?.kind !== 'complete') throw new Error('Expected completed worker report');
    expect(complete.report.evaluated).toBe(4096);
    expect(complete.report.feasible).toBe(4096);
    expect(complete.report.results).toHaveLength(10);
    expect(complete.report.results.every(r => r.score === 286)).toBe(true);
    expect(complete.report.missedBounds.every(b => b.builds === 0)).toBe(true);
    expect(complete.report.rejected).toBe(0);
    expect(JSON.stringify(input)).toBe(original);
    scope.onmessage!(new MessageEvent('message', { data: { runId: 12, revision: 2, input: { ...input, options: { ...input.options, minimums: {} } } } }));
    expect(posted.at(-1)).toMatchObject({ runId: 12, revision: 2, kind: 'error', message: expect.stringContaining('minimum target') });
  } finally { vi.unstubAllGlobals(); }
});
