import { afterEach, expect, test, vi } from 'vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import InventoryWorkspace from './InventoryWorkspace';
import ScannerPanel from './ScannerPanel';
import { decodeScannerStatus, type ScannerStatus } from './scanner-api';
import { parseInventory } from '../../domain/inventory';
import { loadInventory, saveInventory } from '../../storage/inventory';

vi.mock('../../storage/inventory', () => ({ loadInventory: vi.fn(), saveInventory: vi.fn() }));
vi.mock('../../storage/comparison', async original => ({ ...await original<typeof import('../../storage/comparison')>(), loadComparisons: vi.fn(async () => []) }));
vi.mock('../../storage/speed', async original => ({ ...await original<typeof import('../../storage/speed')>(), loadTeam: vi.fn(async () => null) }));
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });
const fixture = { source: 'reliquary_archiver', version: 4, relics: [{ _uid: 'new', set_id: '102', name: 'Musketeer of Wild Wheat', slot: 'Head', rarity: 5, level: 15, mainstat: 'HP', substats: [{ key: 'SPD', value: 2.032 }], preview_substats: [{ key: 'ATK', value: 16.9 }], location: '', lock: true, discard: false }] };
const prior = parseInventory(JSON.stringify({ ...fixture, relics: [{ ...fixture.relics[0], _uid: 'prior' }, { ...fixture.relics[0], _uid: 'prior-2' }] }));
const id = '11111111-1111-1111-1111-111111111111';
function api(options: { supported?: boolean; installed?: boolean; running?: boolean; result?: unknown } = {}) {
  let job: ScannerStatus['job'] = null;
  const fetcher = vi.fn(async (input: string | URL | Request, init?: RequestInit) => {
    const path = String(input);
    expect(new Headers(init?.headers).get('X-Orbit-Client')).toBe('1');
    if (path.endsWith('/session')) return new Response(JSON.stringify({ token: 'a'.repeat(64) }));
    expect(new Headers(init?.headers).get('X-Orbit-Session')).toBe('a'.repeat(64));
    if (path.endsWith('/status')) return new Response(JSON.stringify({ supported: options.supported ?? true, installed: options.installed ?? true, engineVersion: '0.19.0', job }));
    if (path.endsWith('/scan') && init?.method === 'POST') { job = { id, state: options.running ? 'capturing' : 'ready', message: options.running ? 'Synthetic scanner listening.' : 'Synthetic scan received.' }; return new Response(JSON.stringify({ id }), { status: 202 }); }
    if (path.endsWith('/result')) return new Response(JSON.stringify(options.result ?? fixture));
    if (init?.method === 'DELETE') { job = { id, state: options.running ? 'discarding' : 'cancelled', message: options.running ? 'Waiting for native completion.' : 'Scan discarded.' }; return new Response('{}'); }
    throw new Error(`Unexpected test request ${path}`);
  });
  vi.stubGlobal('fetch', fetcher);
  return { fetcher, finish: () => { job = { id, state: 'cancelled', message: 'Scan discarded.' }; } };
}
async function openWorkspace() {
  vi.mocked(loadInventory).mockResolvedValue(prior); vi.mocked(saveInventory).mockReset();
  const activated = vi.fn(); const user = userEvent.setup();
  render(<InventoryWorkspace visible onInventory={activated} />);
  await screen.findByText('2 of 2 imported relics'); activated.mockClear();
  await user.click(screen.getByText('Scan inventory from HSR'));
  await screen.findByText(/Scanner ready · Reliquary/);
  return { user, activated };
}
test('a closed scan panel makes no scanner request; preview/cancel/failing-save retain the prior inventory', async () => {
  const { fetcher } = api();
  vi.mocked(loadInventory).mockResolvedValue(prior); vi.mocked(saveInventory).mockReset();
  const activated = vi.fn(); const user = userEvent.setup();
  render(<InventoryWorkspace visible onInventory={activated} />);
  await screen.findByText('2 of 2 imported relics'); activated.mockClear();
  expect(fetcher).not.toHaveBeenCalled();
  await user.click(screen.getByText('Scan inventory from HSR'));
  await screen.findByText(/Scanner ready · Reliquary/);
  await user.click(screen.getByRole('button', { name: 'Scan inventory' }));
  await user.click(await screen.findByRole('button', { name: 'Review scan' }));
  await screen.findByText(/1 relic from reliquary_archiver/);
  expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Replace inventory' }).parentElement);
  expect(saveInventory).not.toHaveBeenCalled();
  await user.click(screen.getByRole('button', { name: 'Cancel import' }));
  expect(screen.getByText('2 of 2 imported relics')).toBeTruthy();
  await user.click(screen.getByRole('button', { name: 'Reconnect scanner' }));
  await screen.findByText('Scan discarded.');
  await user.click(screen.getByRole('button', { name: 'Scan inventory' }));
  await user.click(await screen.findByRole('button', { name: 'Review scan' }));
  await screen.findByText(/1 relic from reliquary_archiver/);
  vi.mocked(saveInventory).mockRejectedValueOnce(new Error('Storage full')).mockResolvedValueOnce();
  await user.click(screen.getByRole('button', { name: 'Replace inventory' }));
  expect(await screen.findByRole('alert')).toHaveProperty('textContent', 'Storage full');
  expect(screen.getByText('2 of 2 imported relics')).toBeTruthy(); expect(activated).not.toHaveBeenCalled();
  await user.click(screen.getByRole('button', { name: 'Replace inventory' }));
  await screen.findByText('1 of 1 imported relics'); expect(activated).toHaveBeenCalledTimes(1);
  const saved = vi.mocked(saveInventory).mock.calls.at(-1)![0];
  expect(saved.precision).toBe('packet'); expect(saved.relics[0].substats[0].value).toBe(2.032);
  expect(saved.relics[0].preview).toEqual([{ key: 'ATK', value: 16.9 }]);
});
test('an invalid scanned schema never reaches inventory preview or persistence', async () => {
  api({ result: { ...fixture, version: 5 } });
  const { user } = await openWorkspace();
  await user.click(screen.getByRole('button', { name: 'Scan inventory' }));
  await user.click(await screen.findByRole('button', { name: 'Review scan' }));
  expect(await screen.findByRole('alert')).toHaveProperty('textContent', 'version: only scanner schema 4 is supported');
  expect(screen.queryByRole('button', { name: 'Replace inventory' })).toBeNull();
  expect(screen.getByText('2 of 2 imported relics')).toBeTruthy(); expect(saveInventory).not.toHaveBeenCalled();
});
test('discard waits for native exit, disables re-scan and keeps the saved inventory', async () => {
  const fake = api({ running: true }); const { user } = await openWorkspace();
  await user.click(screen.getByRole('button', { name: 'Scan inventory' }));
  await screen.findByText('Synthetic scanner listening.');
  expect(screen.getByLabelText('Import scanner JSON or Orbit backup')).toHaveProperty('disabled', true);
  await user.click(screen.getByRole('button', { name: 'Discard scan' }));
  await screen.findByText('Waiting for native completion.');
  expect(screen.getByRole('button', { name: 'Scan inventory' })).toHaveProperty('disabled', true);
  expect(screen.getByRole('button', { name: 'Discard scan' })).toHaveProperty('disabled', true);
  fake.finish();
  await screen.findByText('Scan discarded.', {}, { timeout: 3000 });
  await waitFor(() => expect(screen.getByRole('button', { name: 'Scan inventory' })).toHaveProperty('disabled', false));
  expect(screen.getByText('2 of 2 imported relics')).toBeTruthy(); expect(saveInventory).not.toHaveBeenCalled();
});
test('frontend-only runtime failure offers reconnect without starting native work', async () => {
  const fetcher = vi.fn().mockRejectedValue(new Error('Unavailable')); vi.stubGlobal('fetch', fetcher);
  const preview = vi.fn(); const user = userEvent.setup();
  const { unmount } = render(<ScannerPanel disabled={false} onPreview={preview} onBusy={() => {}} />);
  await screen.findByText(/Scanner runtime unavailable/);
  await user.click(screen.getByRole('button', { name: 'Reconnect scanner' }));
  await screen.findByText(/Scanner runtime unavailable/);
  expect(fetcher).toHaveBeenCalledTimes(2);
  expect(fetcher.mock.calls.every(([, init]) => init.method === 'GET')).toBe(true);
  unmount(); expect(fetcher.mock.calls.every(([, init]) => init.signal.aborted)).toBe(true);
  expect(preview).not.toHaveBeenCalled();
});
test.each([{ supported: false, installed: false, copy: /Integrated scanning requires Windows x64/ }, { supported: true, installed: false, copy: /Scanner engine unavailable/ }])('unavailable scanner capability prevents Scan ($supported/$installed)', async ({ supported, installed, copy }) => {
  api({ supported, installed });
  render(<ScannerPanel disabled={false} onPreview={() => {}} onBusy={() => {}} />);
  await screen.findByText(copy);
  expect(screen.getByRole('button', { name: 'Scan inventory' })).toHaveProperty('disabled', true);
});
test('status decoder rejects unknown states and malformed job IDs', () => {
  const valid = { supported: true, installed: true, engineVersion: '0.19.0', job: { id, state: 'ready', message: 'Synthetic' } };
  expect(decodeScannerStatus(valid).job?.id).toBe(id);
  expect(() => decodeScannerStatus({ ...valid, job: { ...valid.job, state: 'complete' } })).toThrow('Invalid scan state');
  expect(() => decodeScannerStatus({ ...valid, job: { ...valid.job, id: '../secret' } })).toThrow('Invalid scan state');
});
