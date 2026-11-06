import { fileURLToPath } from 'node:url';
import { ENGINE, installEngine } from '../server/engine.mjs';

if (process.platform !== 'win32' || process.arch !== 'x64') {
  console.error('The integrated scanner requires Windows x64. JSON import works on other platforms.');
  process.exitCode = 1;
} else {
  try {
    await installEngine(fileURLToPath(new URL('../', import.meta.url)));
    console.log(`Verified Reliquary ${ENGINE.version}. No scan has been started.`);
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
