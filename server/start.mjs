import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { access } from 'node:fs/promises';
import { installEngine } from './engine.mjs';
import { Scanner } from './scanner.mjs';
import { createOrbitServer } from './http.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
let server;
try {
  await access(join(root, 'dist', 'index.html'));
  const scanner = new Scanner(root);
  server = createOrbitServer({ scanner, dist: join(root, 'dist') });
  await new Promise((accept, reject) => { server.once('error', reject); server.listen(4173, '127.0.0.1', accept); });
  // Reserve the origin before installing/cleaning; a second Orbit process must not touch an active workspace.
  if (scanner.supported) {
    console.log('Checking the pinned scanner (first launch downloads it from GitHub). No capture starts now.');
    try { await installEngine(root); } catch (error) { console.error(error.message); }
  }
  await scanner.initialize();
  console.log('Orbit: http://127.0.0.1:4173. Capture starts only when you choose Scan inventory.');
  let stopping = false;
  async function stop() {
    if (stopping) return;
    stopping = true;
    console.log('Closing Orbit. Any native scan will finish its bounded capture before exit.');
    server.close();
    await scanner.close();
  }
  process.on('SIGINT', stop); process.on('SIGTERM', stop);
} catch (error) {
  server?.close();
  console.error(error.code === 'EADDRINUSE' ? 'Port 4173 is occupied. Stop the existing Orbit dev/preview/runtime first.' : 'Orbit could not start. Run npm run build and check local filesystem access.');
  process.exitCode = 1;
}
