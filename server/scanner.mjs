import { randomUUID } from 'node:crypto';
import { spawn } from 'node:child_process';
import { mkdir, readFile, stat, unlink, rmdir, readdir } from 'node:fs/promises';
import { join, resolve, sep } from 'node:path';
import { ENGINE, enginePath, verifyEngine } from './engine.mjs';

export const MAX_EXPORT_BYTES = 20 * 1024 * 1024;
export const RESULT_TTL = 5 * 60 * 1000;
const busyStates = new Set(['permission', 'starting', 'capturing', 'discarding']);
const files = ['output.json', 'status.json', 'status.tmp', 'stdout.txt', 'stderr.txt', 'stdin.txt', 'crashlog.txt'];
const messages = {
  permission: 'Approve the Windows Administrator request to start the scanner.',
  starting: 'Starting the scanner. Stay on the HSR Click to Start screen.',
  capturing: 'Scanner is listening. Enter HSR now, within the 120-second capture window.',
  discarding: 'Result discarded. Waiting for the native process to finish; close a pending Windows prompt or wait for the capture timeout.',
  ready: 'Scan received. Review the inventory before replacing your saved collection.',
  cancelled: 'Scan discarded. Your saved inventory has not changed.',
  expired: 'Scan result expired after five minutes. Start another scan.',
};
function pick(value, keys) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Invalid scanner record.');
  return Object.fromEntries(keys.filter(key => value[key] !== undefined).map(key => {
    if (!['string', 'number', 'boolean'].includes(typeof value[key])) throw new Error('Invalid scanner field.');
    return [key, value[key]];
  }));
}
function list(value) {
  if (!Array.isArray(value) || value.length > 10000) throw new Error('Scanner export exceeds the supported record limit.');
  return value;
}
export function projectExport(text) {
  let raw;
  try { raw = JSON.parse(text); } catch { throw new Error('Scanner output is not valid JSON. Retry the scan or use JSON import.'); }
  if (raw?.source !== 'reliquary_archiver' || raw.version !== 4) throw new Error('Unsupported scanner source or schema.');
  return JSON.stringify({
    source: raw.source, version: raw.version,
    relics: list(raw.relics).map(record => ({
      ...pick(record, ['_uid', 'set_id', 'name', 'slot', 'rarity', 'level', 'mainstat', 'location', 'lock', 'discard']),
      ...Object.fromEntries(['substats', 'preview_substats', 'reroll_substats'].filter(key => record[key] != null).map(key => [key, list(record[key]).map(s => pick(s, ['key', 'value']))])),
    })),
    characters: list(raw.characters ?? []).map(c => pick(c, ['id', 'name'])),
    light_cones: list(raw.light_cones ?? []).map(c => pick(c, ['id', 'name', '_uid', 'location'])),
  });
}
export function launchNative(root, directory) {
  const payload = Buffer.from(JSON.stringify({ engine: enginePath(root), directory })).toString('base64');
  const executable = join(process.env.SystemRoot ?? 'C:\\Windows', 'System32', 'WindowsPowerShell', 'v1.0', 'powershell.exe');
  // Legacy Windows PowerShell can exit without executing -File when started detached.
  const child = spawn(executable, ['-NoProfile', '-NonInteractive', '-ExecutionPolicy', 'Bypass', '-File', join(root, 'server', 'launch-scan.ps1'), '-Payload', payload], { windowsHide: true, stdio: 'ignore', shell: false });
  return new Promise((accept, reject) => {
    child.once('error', () => reject(new Error('Windows could not start PowerShell for the scanner. Check Windows app restrictions. [helper:spawn]')));
    child.once('close', code => {
      const errors = {
        20: 'Windows Administrator permission was cancelled. Retry and approve the Windows request.',
        21: 'Windows could not request Administrator permission. Check Windows app restrictions and retry.',
        22: 'Windows did not return the helper exit code. Restart Orbit and retry.',
        23: 'The elevated helper exited before it finished setup. Restart Orbit and retry.',
      };
      code === 0 ? accept() : reject(new Error(`${errors[code] ?? 'The scanner helper stopped unexpectedly.'} [helper:${code ?? 'terminated'}]`));
    });
  });
}

export class Scanner {
  constructor(root, { launch = launchNative, verify = verifyEngine, supported = process.platform === 'win32' && process.arch === 'x64', now = Date.now } = {}) {
    this.root = resolve(root); this.runs = join(this.root, '.cache', 'scanner', 'runs');
    this.launch = launch; this.verify = verify; this.supported = supported; this.now = now;
    this.job = null; this.operation = null; this.closing = false; this.available = false;
  }
  async initialize() {
    if (this.supported) {
      try { await this.verify(enginePath(this.root)); this.available = true; } catch { this.available = false; }
    }
    await mkdir(this.runs, { recursive: true });
    for (const entry of await readdir(this.runs, { withFileTypes: true })) {
      if (!entry.isDirectory() || !/^[0-9a-f-]{36}$/.test(entry.name)) continue;
      const directory = join(this.runs, entry.name);
      const age = this.now() - (await stat(directory)).mtimeMs;
      if (age > 10 * 60 * 1000) await this.clean(directory);
    }
  }
  async clean(directory) {
    if (!resolve(directory).startsWith(resolve(this.runs) + sep)) throw new Error('Invalid scan directory.');
    for (const file of files) await unlink(join(directory, file)).catch(error => { if (error.code !== 'ENOENT') throw error; });
    await rmdir(directory).catch(error => { if (error.code !== 'ENOENT') throw error; });
  }
  async status() {
    const job = this.job;
    if (job?.state === 'ready' && this.now() >= job.expiresAt) { job.result = null; job.state = 'expired'; }
    if (job && ['permission', 'starting', 'capturing'].includes(job.state) && job.directory) {
      try {
        const raw = JSON.parse(await readFile(join(job.directory, 'status.json'), 'utf8'));
        if (['starting', 'capturing'].includes(raw.state) && this.job === job && busyStates.has(job.state) && !job.discard) job.state = raw.state;
      } catch { /* A not-yet-written state file leaves the previous stage visible. */ }
    }
    return { supported: this.supported, installed: this.available, engineVersion: ENGINE.version, job: job ? { id: job.id, state: job.state, message: job.error ?? messages[job.state] } : null };
  }
  start() {
    if (this.closing || busyStates.has(this.job?.state)) throw new Error('A scanner process is still finishing. Wait before starting another scan.');
    if (!this.supported) throw new Error('Integrated scanning requires Windows x64. Use JSON import on this platform.');
    if (!this.available) throw new Error('Scanner engine is not installed. Stop Orbit, run npm run scanner:setup, then npm start.');
    clearTimeout(this.expiryTimer);
    const job = { id: randomUUID(), state: 'permission', discard: false, result: null };
    this.job = job;
    this.operation = this.run(job);
    return { id: job.id };
  }
  async run(job) {
    let stage = 'engine';
    try {
      await this.verify(enginePath(this.root));
      stage = 'directory';
      job.directory = join(this.runs, job.id);
      await mkdir(job.directory, { recursive: false });
      stage = 'helper';
      if (!job.discard) await this.launch(this.root, job.directory);
      if (!job.discard) {
        const crashed = await stat(join(job.directory, 'crashlog.txt')).then(() => true, error => { if (error.code === 'ENOENT') return false; throw error; });
        if (crashed) throw new Error('Scanner stopped unexpectedly. Return to Click to Start and retry, or use JSON import.');
        stage = 'status';
        const state = JSON.parse(await readFile(join(job.directory, 'status.json'), 'utf8'));
        if (state.state === 'failed') {
          const reasons = { privilege: 'Windows did not grant Administrator privileges to the reader.', engine: 'The scanner engine could not be verified. Stop Orbit, run npm run scanner:setup, then npm start.', native: 'Windows could not start the scanner engine. Check Windows Security protection history for a blocked application.', capture: 'The scanner process failed while running. Return to Click to Start and retry.' };
          throw new Error(reasons[state.reason] ?? 'Windows scanner setup failed. Restart Orbit and retry.');
        }
        if (state.state === 'incomplete' && typeof state.reason === 'string') {
          const reasons = { exit_unknown: 'Windows did not return the reader exit code.', native_exit: 'The native reader exited with an error.', crash: 'The native reader crashed.', unsupported_version: 'The pinned reader does not support the detected game protocol. A reviewed engine update is needed.', capture_setup: 'Windows Packet Monitor could not initialize capture.', initialization_missing: 'The reader exited before reporting complete inventory initialization.', export_missing: 'The reader completed initialization but did not write its export.' };
          if (Object.hasOwn(reasons, state.reason)) throw new Error(`${reasons[state.reason]} [reader:${state.reason}]`);
        }
        if (state.state !== 'complete') throw new Error(state.state === 'occupied' ? 'Another Orbit scan is active. Wait for it to finish.' : 'No complete inventory received. Return to Click to Start and retry. The game version may need a scanner update.');
        stage = 'output';
        if ((await stat(join(job.directory, 'output.json'))).size > MAX_EXPORT_BYTES) throw new Error('Scanner output exceeds the 20 MiB import limit.');
        job.result = projectExport(await readFile(join(job.directory, 'output.json'), 'utf8'));
        job.expiresAt = this.now() + RESULT_TTL;
      }
    } catch (error) {
      if (!job.discard) {
        if (!error.code) job.error = error.message;
        else {
          const code = /^[A-Z0-9_]+$/.test(error.code) ? error.code : 'IO';
          const hints = { engine: 'Scanner engine is missing or unreadable. Stop Orbit, run npm run scanner:setup, then npm start.', directory: 'Could not create the temporary scan folder. Check write access to the Orbit folder.', status: 'Windows helper returned without a readable scan status. Restart Orbit and retry.', output: 'Scanner finished without a readable export. Return to Click to Start and retry.', helper: 'Could not read the Windows helper result.' };
          job.error = `${hints[stage]} [${stage}:${code}]`;
          if (stage === 'engine') this.available = false;
        }
      }
    }
    finally {
      if (job.directory) {
        try { await this.clean(job.directory); } catch { job.error = 'Could not remove temporary scan files. Stop Orbit and check .cache/scanner/runs before retrying.'; }
      }
      job.state = job.error ? 'failed' : job.discard ? 'cancelled' : 'ready';
      if (job.state !== 'ready') job.result = null;
      else {
        this.expiryTimer = setTimeout(() => { if (this.job === job) { job.result = null; job.state = 'expired'; } }, RESULT_TTL);
        this.expiryTimer.unref();
      }
    }
  }
  cancel(id) {
    if (!this.job || this.job.id !== id) throw new Error('This scan is no longer active.');
    clearTimeout(this.expiryTimer);
    this.job.discard = true; this.job.result = null;
    this.job.state = busyStates.has(this.job.state) ? 'discarding' : 'cancelled';
  }
  result(id) {
    if (!this.job || this.job.id !== id || this.job.state !== 'ready' || this.now() >= this.job.expiresAt) throw new Error('This scan result is unavailable or expired. Start another scan.');
    return this.job.result;
  }
  async close() {
    this.closing = true;
    if (this.job) this.cancel(this.job.id);
    await this.operation;
  }
}
