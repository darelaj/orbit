import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { writeFile } from 'node:fs/promises';
import { Scanner } from '../../server/scanner.mjs';
import { createOrbitServer } from '../../server/http.mjs';

// Manual UI harness: the native adapter only writes labeled synthetic JSON; it cannot capture the game.
const root = fileURLToPath(new URL('../../', import.meta.url));
const incomplete = process.argv.includes('--incomplete');
const scanner = new Scanner(join(root, '.cache', 'scanner-browser'), {
  supported: true, verify: async () => {},
  launch: async (_, directory) => {
    await writeFile(join(directory, 'status.json'), '{"state":"capturing"}');
    await new Promise(accept => setTimeout(accept, 2500));
    await writeFile(join(directory, 'output.json'), JSON.stringify({ source: 'reliquary_archiver', version: 4, relics: [{
      _uid: 'synthetic_browser_scan', set_id: '102', name: 'Musketeer of Wild Wheat', slot: 'Head', rarity: 5, level: 15,
      mainstat: 'HP', substats: [{ key: 'SPD', value: 2.032 }], preview_substats: [{ key: 'ATK', value: 16.9 }],
      location: '', lock: true, discard: false,
    }] }));
    await writeFile(join(directory, 'status.json'), JSON.stringify({ state: incomplete ? 'incomplete' : 'complete' }));
  },
});
const originalStatus = scanner.status.bind(scanner);
scanner.status = async () => {
  const status = await originalStatus();
  return { ...status, engineVersion: '0.19.0 (synthetic QA)', job: status.job ? { ...status.job, message: `Synthetic QA: ${status.job.message}` } : null };
};
await scanner.initialize();
const server = createOrbitServer({ scanner, dist: join(root, 'dist') });
server.listen(4173, '127.0.0.1', () => console.log(`SYNTHETIC scanner UI harness: http://127.0.0.1:4173 (${incomplete ? 'incomplete' : 'complete'} output). No native process, elevation or capture.`));
server.on('error', error => { console.error(error.code); process.exitCode = 1; });
let stopping = false;
async function stop() { if (stopping) return; stopping = true; server.close(); await scanner.close(); }
process.on('SIGINT', stop); process.on('SIGTERM', stop);
