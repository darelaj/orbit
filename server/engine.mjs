import { createHash } from 'node:crypto';
import { readFile, mkdir, writeFile, rename, unlink } from 'node:fs/promises';
import { join } from 'node:path';
import pin from './scanner-pin.json' with { type: 'json' };

export const ENGINE = Object.freeze({
  ...pin,
  name: 'reliquary-archiver-pktmon-x64.exe',
  url: 'https://github.com/IceDynamix/reliquary-archiver/releases/download/v0.19.0/reliquary-archiver-pktmon-x64.exe',
});
export function enginePath(root) { return join(root, '.cache', 'scanner', ENGINE.version, ENGINE.name); }
export function verifyEngineBytes(bytes) {
  if (bytes.length !== ENGINE.bytes || createHash('sha256').update(bytes).digest('hex') !== ENGINE.sha256) {
    throw new Error('Scanner checksum mismatch. Run npm run scanner:setup to restore the pinned engine.');
  }
}
export async function verifyEngine(path) { verifyEngineBytes(await readFile(path)); }
export async function installEngine(root, fetcher = fetch) {
  const path = enginePath(root);
  try { await verifyEngine(path); return path; } catch (error) {
    if (error.code && error.code !== 'ENOENT') throw error;
  }
  const response = await fetcher(ENGINE.url, { signal: AbortSignal.timeout(120000) });
  if (!response.ok || !response.body) throw new Error('Could not download the pinned scanner. Check your GitHub connection and retry.');
  const chunks = []; let size = 0;
  for await (const chunk of response.body) {
    size += chunk.length;
    if (size > ENGINE.bytes) throw new Error('Scanner download exceeds its pinned size.');
    chunks.push(chunk);
  }
  const bytes = Buffer.concat(chunks);
  verifyEngineBytes(bytes);
  await mkdir(join(root, '.cache', 'scanner', ENGINE.version), { recursive: true });
  const temporary = `${path}.${process.pid}.download`;
  try { await writeFile(temporary, bytes, { flag: 'wx' }); await rename(temporary, path); }
  finally { await unlink(temporary).catch(error => { if (error.code !== 'ENOENT') throw error; }); }
  return path;
}
