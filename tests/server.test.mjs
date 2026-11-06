import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, readdir, rm, open, utimes } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve, sep } from 'node:path';
import { ENGINE, installEngine, verifyEngineBytes, enginePath } from '../server/engine.mjs';
import { Scanner, MAX_EXPORT_BYTES, RESULT_TTL, projectExport, launchNative } from '../server/scanner.mjs';
import { createOrbitServer } from '../server/http.mjs';
import { request } from 'node:http';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';

const record = { _uid: '1', set_id: '102', name: 'Musketeer of Wild Wheat', slot: 'Head', rarity: 5, level: 15, mainstat: 'HP', substats: [{ key: 'SPD', value: 2.032, count: 1, secret: 'drop' }], preview_substats: [{ key: 'ATK', value: 16.9 }], location: '', lock: true, discard: false };
const fixture = { source: 'reliquary_archiver', version: 4, relics: [record], characters: [{ id: '1308', name: 'Acheron', skills: { secret: true } }], light_cones: [{ id: '23024', name: 'Synthetic', _uid: '2', location: '' }], metadata: { uid: 'private' }, gacha: { private: true }, materials: [{ private: true }] };
test('Windows PowerShell 5.1 parses both helpers without executing them', { skip: process.platform !== 'win32' }, () => {
  for (const file of ['launch-scan.ps1', 'scan-worker.ps1']) {
    const path = fileURLToPath(new URL(`../server/${file}`, import.meta.url)).replaceAll("'", "''");
    const command = `$errors = $null; [System.Management.Automation.Language.Parser]::ParseFile('${path}', [ref]$null, [ref]$errors) | Out-Null; if ($errors.Count -gt 0) { $errors | Out-String | Write-Error; exit 1 }`;
    const parsed = spawnSync(join(process.env.SystemRoot, 'System32', 'WindowsPowerShell', 'v1.0', 'powershell.exe'), ['-NoProfile', '-NonInteractive', '-Command', command], { windowsHide: true, encoding: 'utf8' });
    assert.equal(parsed.status, 0, parsed.stderr);
  }
});
async function workspace(t) {
  const root = await mkdtemp(join(tmpdir(), 'orbit-scanner-test-'));
  t.after(async () => {
    assert.ok(resolve(root).startsWith(resolve(tmpdir()) + sep) && root.includes('orbit-scanner-test-'));
    await rm(root, { recursive: true, force: true });
  });
  return root;
}
async function windowsHelperFixture(root) {
  const server = join(root, 'server'); await mkdir(server, { recursive: true });
  const worker = await readFile(new URL('../server/scan-worker.ps1', import.meta.url), 'utf8');
  assert.ok(worker.includes('Local\\OrbitReliquaryCapture'));
  // Test processes must not contend with the owner's live capture mutex.
  await writeFile(join(server, 'scan-worker.ps1'), worker.replace('Local\\OrbitReliquaryCapture', `Local\\OrbitTest-${randomUUID()}`));
  for (const file of ['scanner-pin.json', 'launch-scan.ps1']) await writeFile(join(server, file), await readFile(new URL(`../server/${file}`, import.meta.url)));
  return server;
}
test('actual Node launcher executes a harmless PowerShell fixture with hidden stdio', { skip: process.platform !== 'win32' }, async t => {
  const parent = await workspace(t); const root = join(parent, "fixture space's root");
  await mkdir(join(root, 'server'), { recursive: true });
  const marker = join(root, 'called.json');
  await writeFile(join(root, 'server', 'launch-scan.ps1'), `param([string]$Payload)\n[IO.File]::WriteAllText('${marker.replaceAll("'", "''")}', [Text.Encoding]::UTF8.GetString([Convert]::FromBase64String($Payload)))\nexit 0\n`);
  await launchNative(root, root);
  const recorded = JSON.parse(await readFile(marker, 'utf8'));
  assert.equal(recorded.directory, root); assert.equal(recorded.engine, enginePath(root));
});
test('Windows worker bootstrap writes failure status without elevation or a real engine', { skip: process.platform !== 'win32' }, async t => {
  const root = await workspace(t);
  const directory = join(root, "scan space's directory"); await mkdir(directory);
  const engine = join(root, 'invalid-engine.exe'); await writeFile(engine, 'synthetic non-executable');
  const payload = Buffer.from(JSON.stringify({ directory, engine })).toString('base64');
  const helper = join(await windowsHelperFixture(root), 'scan-worker.ps1');
  // An invalid engine cannot pass the pinned checksum even if the test host is already elevated.
  const parsed = spawnSync(join(process.env.SystemRoot, 'System32', 'WindowsPowerShell', 'v1.0', 'powershell.exe'), ['-NoProfile', '-NonInteractive', '-ExecutionPolicy', 'Bypass', '-File', helper, '-Payload', payload], { windowsHide: true, encoding: 'utf8', timeout: 10000 });
  assert.equal(parsed.status, 0, parsed.stderr);
  assert.equal(JSON.parse(await readFile(join(directory, 'status.json'), 'utf8')).state, 'failed');
});
test('Windows launcher reaches the elevation boundary without calling RunAs', { skip: process.platform !== 'win32' }, async t => {
  const root = await workspace(t); const captured = join(root, 'arguments.json');
  const helper = fileURLToPath(new URL('../server/launch-scan.ps1', import.meta.url));
  const literal = value => value.replaceAll("'", "''");
  const payload = Buffer.from(JSON.stringify({ directory: root, engine: join(root, 'not-executed.exe') })).toString('base64');
  const command = `function Start-Process { param($FilePath,$Verb,$WindowStyle,$ArgumentList,[switch]$Wait,[switch]$PassThru); [IO.File]::WriteAllText('${literal(captured)}', (ConvertTo-Json -InputObject @{verb=$Verb;style=$WindowStyle;args=@($ArgumentList)} -Compress)); $fake = [pscustomobject]@{ExitCode=0;Handle=0}; $fake | Add-Member ScriptMethod WaitForExit {}; $fake | Add-Member ScriptMethod Refresh {}; $fake }; & '${literal(helper)}' -Payload '${payload}'; exit $LASTEXITCODE`;
  const parsed = spawnSync(join(process.env.SystemRoot, 'System32', 'WindowsPowerShell', 'v1.0', 'powershell.exe'), ['-NoProfile', '-NonInteractive', '-ExecutionPolicy', 'Bypass', '-EncodedCommand', Buffer.from(command, 'utf16le').toString('base64')], { windowsHide: true, encoding: 'utf8', timeout: 10000 });
  assert.equal(parsed.status, 0, parsed.stderr);
  const capturedLaunch = JSON.parse(await readFile(captured, 'utf8'));
  assert.equal(capturedLaunch.verb, 'RunAs'); assert.equal(capturedLaunch.style, 'Hidden');
  const args = capturedLaunch.args;
  assert.equal(args.at(-2), '-Payload');
  assert.equal(args.at(-1), payload);
  assert.ok(args[args.indexOf('-File') + 1].includes('scan-worker.ps1'));
});
test('Windows launcher waits for an asynchronous child and propagates its failure', { skip: process.platform !== 'win32' }, async t => {
  const root = await workspace(t);
  const helper = fileURLToPath(new URL('../server/launch-scan.ps1', import.meta.url)).replaceAll("'", "''");
  const payload = Buffer.from(JSON.stringify({ directory: root, engine: join(root, 'never-executed.exe') })).toString('base64');
  const command = `function Start-Process { param($FilePath,$Verb,$WindowStyle,$ArgumentList,[switch]$Wait,[switch]$PassThru); Microsoft.PowerShell.Management\\Start-Process -FilePath $FilePath -WindowStyle Hidden -ArgumentList @('-NoProfile','-NonInteractive','-Command','Start-Sleep -Milliseconds 100; exit 7') -PassThru }; & '${helper}' -Payload '${payload}'; exit $LASTEXITCODE`;
  const parsed = spawnSync(join(process.env.SystemRoot, 'System32', 'WindowsPowerShell', 'v1.0', 'powershell.exe'), ['-NoProfile', '-NonInteractive', '-ExecutionPolicy', 'Bypass', '-EncodedCommand', Buffer.from(command, 'utf16le').toString('base64')], { windowsHide: true, encoding: 'utf8', timeout: 10000 });
  assert.equal(parsed.status, 23, parsed.stderr);
});
test('Windows helper chain forwards paths with spaces through a real unelevated child', { skip: process.platform !== 'win32' }, async t => {
  const root = await workspace(t); const directory = join(root, "scan space's directory"); await mkdir(directory);
  const engine = join(root, 'invalid-engine.exe'); await writeFile(engine, 'synthetic non-executable');
  const payload = Buffer.from(JSON.stringify({ directory, engine })).toString('base64');
  const helper = join(await windowsHelperFixture(root), 'launch-scan.ps1').replaceAll("'", "''");
  const command = `function Start-Process { param($FilePath,$Verb,$WindowStyle,$ArgumentList,[switch]$Wait,[switch]$PassThru); Microsoft.PowerShell.Management\\Start-Process -FilePath $FilePath -WindowStyle Hidden -ArgumentList $ArgumentList -PassThru }; & '${helper}' -Payload '${payload}'; exit $LASTEXITCODE`;
  const parsed = spawnSync(join(process.env.SystemRoot, 'System32', 'WindowsPowerShell', 'v1.0', 'powershell.exe'), ['-NoProfile', '-NonInteractive', '-ExecutionPolicy', 'Bypass', '-EncodedCommand', Buffer.from(command, 'utf16le').toString('base64')], { windowsHide: true, encoding: 'utf8', timeout: 10000 });
  assert.equal(parsed.status, 0, parsed.stderr);
  assert.equal(JSON.parse(await readFile(join(directory, 'status.json'), 'utf8')).state, 'failed');
});
test('scan failures identify engine, folder, helper status and reader setup without exposing paths', async t => {
  const engine = await makeScanner(t);
  engine.verify = async () => { throw Object.assign(new Error('private local path'), { code: 'ENOENT' }); };
  engine.start(); await engine.operation;
  const missing = await engine.status(); assert.equal(missing.installed, false);
  assert.match(missing.job.message, /\[engine:ENOENT\]/); assert.ok(!missing.job.message.includes('private local path'));
  const folder = await makeScanner(t); await rm(folder.runs, { recursive: true });
  folder.start(); await folder.operation;
  assert.match((await folder.status()).job.message, /\[directory:ENOENT\]/);
  const status = await makeScanner(t, { launch: async () => {} }); status.start(); await status.operation;
  assert.match((await status.status()).job.message, /\[status:ENOENT\]/);
  const native = await makeScanner(t, { launch: async (_, directory) => { await writeFile(join(directory, 'status.json'), JSON.stringify({ state: 'failed', reason: 'native' })); } });
  native.start(); await native.operation;
  assert.match((await native.status()).job.message, /Windows could not start the scanner engine/);
});
async function output(directory, state = 'complete', value = fixture) {
  await writeFile(join(directory, 'status.json'), JSON.stringify({ state }));
  await writeFile(join(directory, 'output.json'), JSON.stringify(value));
  await writeFile(join(directory, 'stdout.txt'), 'synthetic process output');
}
async function makeScanner(t, options = {}) {
  const scanner = new Scanner(await workspace(t), { supported: true, verify: async () => {}, launch: async (_, directory) => output(directory), ...options });
  await scanner.initialize();
  t.after(() => scanner.close());
  return scanner;
}
test('pin verifies size/digest, failed download never publishes an executable', async t => {
  const root = await workspace(t);
  assert.ok(ENGINE.url.includes(`/v${ENGINE.version}/`));
  assert.throws(() => verifyEngineBytes(Buffer.alloc(ENGINE.bytes)), /checksum/);
  await assert.rejects(installEngine(root, async url => {
    assert.equal(url, ENGINE.url);
    return new Response('not an executable');
  }), /checksum/);
  await assert.rejects(readFile(enginePath(root)), /ENOENT/);
  await assert.rejects(installEngine(root, async () => new Response(null, { status: 503 })), /download/);
});
test('projection preserves fractional active/preview values and strips unrelated metadata at every level', () => {
  const result = JSON.parse(projectExport(JSON.stringify(fixture)));
  assert.deepEqual(Object.keys(result).sort(), ['characters', 'light_cones', 'relics', 'source', 'version']);
  assert.deepEqual(result.relics[0].substats, [{ key: 'SPD', value: 2.032 }]);
  assert.deepEqual(result.relics[0].preview_substats, [{ key: 'ATK', value: 16.9 }]);
  assert.deepEqual(result.characters, [{ id: '1308', name: 'Acheron' }]);
  assert.ok(!JSON.stringify(result).includes('private'));
  assert.throws(() => projectExport(JSON.stringify({ ...fixture, version: 5 })), /Unsupported/);
  assert.throws(() => projectExport('private_account_data'), error => /not valid JSON/.test(error.message) && !error.message.includes('private_account_data'));
  assert.throws(() => projectExport(JSON.stringify({ ...fixture, characters: [{ id: { private: 1 } }] })), /Invalid/);
  assert.throws(() => projectExport(JSON.stringify({ ...fixture, relics: Array(10001).fill(record) })), /limit/);
});
test('successful one-shot result expires, uses job identity and removes all run files', async t => {
  let now = 1000;
  const scanner = await makeScanner(t, { now: () => now });
  const { id } = scanner.start(); await scanner.operation;
  assert.equal((await scanner.status()).job.state, 'ready');
  assert.equal(JSON.parse(scanner.result(id)).relics[0].substats[0].value, 2.032);
  assert.deepEqual(await readdir(scanner.runs), []);
  assert.throws(() => scanner.result('old'), /unavailable/);
  now += RESULT_TTL;
  assert.throws(() => scanner.result(id), /expired/);
  assert.equal((await scanner.status()).job.state, 'expired');
});
test('partial, malformed, empty and oversized output never become a ready scan', async t => {
  for (const kind of ['partial', 'malformed', 'missing', 'oversized', 'crash']) {
    const scanner = await makeScanner(t, { launch: async (_, directory) => {
      await output(directory, kind === 'partial' ? 'incomplete' : 'complete');
      if (kind === 'malformed') await writeFile(join(directory, 'output.json'), '{');
      if (kind === 'crash') { await writeFile(join(directory, 'crashlog.txt'), 'private synthetic crash details'); await writeFile(join(directory, 'stdin.txt'), ''); }
      if (kind === 'missing') await rm(join(directory, 'output.json'));
      if (kind === 'oversized') { const file = await open(join(directory, 'output.json'), 'w'); await file.truncate(MAX_EXPORT_BYTES + 1); await file.close(); }
    } });
    const { id } = scanner.start(); await scanner.operation;
    assert.equal((await scanner.status()).job.state, 'failed', kind);
    assert.throws(() => scanner.result(id), /unavailable/);
    assert.deepEqual(await readdir(scanner.runs), []);
  }
});
test('cancel waits for native completion, blocks another scan, and stale IDs cannot touch a later result', async t => {
  let release; let started;
  const entered = new Promise(accept => { started = accept; });
  const native = new Promise(accept => { release = accept; });
  const scanner = await makeScanner(t, { launch: async (_, directory) => { started(); await native; await output(directory); } });
  const first = scanner.start(); await entered;
  scanner.cancel(first.id);
  assert.equal((await scanner.status()).job.state, 'discarding');
  assert.throws(() => scanner.start(), /finishing/);
  assert.throws(() => scanner.result(first.id), /unavailable/);
  release(); await scanner.operation;
  assert.equal((await scanner.status()).job.state, 'cancelled');
  const second = scanner.start(); await scanner.operation;
  assert.notEqual(first.id, second.id);
  assert.throws(() => scanner.cancel(first.id), /no longer/);
  assert.ok(scanner.result(second.id));
});
test('permission denial, checksum change, unsupported and missing engines expose actionable failures without raw output', async t => {
  const denied = await makeScanner(t, { launch: async () => { throw new Error('Permission denied.'); } });
  denied.start(); await denied.operation;
  assert.match((await denied.status()).job.message, /Permission denied/);
  const corrupt = await makeScanner(t);
  corrupt.verify = async () => { throw new Error('Scanner checksum mismatch.'); };
  corrupt.start(); await corrupt.operation;
  assert.match((await corrupt.status()).job.message, /checksum/);
  const unsupported = await makeScanner(t, { supported: false });
  assert.throws(() => unsupported.start(), /Windows x64/);
  const absent = await makeScanner(t, { verify: async () => { throw new Error('missing'); } });
  assert.throws(() => absent.start(), /scanner:setup/);
});
test('shutdown drains the owned native operation and forbids a new scan', async t => {
  let release; let started;
  const entered = new Promise(accept => { started = accept; });
  const native = new Promise(accept => { release = accept; });
  const scanner = await makeScanner(t, { launch: async (_, directory) => { started(); await native; await output(directory); } });
  scanner.start(); await entered;
  let closed = false; const closing = scanner.close().then(() => { closed = true; });
  await Promise.resolve(); assert.equal(closed, false);
  assert.throws(() => scanner.start(), /finishing/);
  release(); await closing;
  assert.equal((await scanner.status()).job.state, 'cancelled');
});
test('startup only cleans aged UUID run directories, preserving recent and unrelated files', async t => {
  const root = await workspace(t); const runs = join(root, '.cache', 'scanner', 'runs');
  const old = join(runs, '11111111-1111-1111-1111-111111111111');
  const recent = join(runs, '22222222-2222-2222-2222-222222222222');
  await mkdir(old, { recursive: true }); await output(old); await utimes(old, new Date(0), new Date(0));
  await mkdir(recent); await writeFile(join(runs, 'owner-file'), 'preserve');
  const scanner = new Scanner(root, { supported: false }); await scanner.initialize();
  assert.deepEqual((await readdir(runs)).sort(), ['22222222-2222-2222-2222-222222222222', 'owner-file']);
});
test('real loopback HTTP rejects foreign origins/hosts, unauthenticated commands, request bodies and path traversal', async t => {
  const scanner = await makeScanner(t);
  const dist = join(scanner.root, 'dist'); await mkdir(dist); await writeFile(join(dist, 'index.html'), '<title>Synthetic Orbit</title>');
  const server = createOrbitServer({ scanner, dist });
  await new Promise(accept => server.listen(0, '127.0.0.1', accept));
  t.after(() => new Promise(accept => server.close(accept)));
  const base = `http://127.0.0.1:${server.address().port}`;
  const call = (path, options = {}) => fetch(base + path, options);
  assert.equal((await call('/')).status, 200);
  assert.equal((await call('/.cache/scanner/runs')).status, 404);
  assert.equal((await call('/%2e%2e%2fpackage.json')).status, 403);
  const foreignHostStatus = await new Promise((accept, reject) => {
    const req = request(base, { headers: { Host: 'evil.test' } }, response => { response.resume(); accept(response.statusCode); });
    req.once('error', reject); req.end();
  });
  assert.equal(foreignHostStatus, 403);
  assert.equal((await call('/api/scanner/session')).status, 403);
  const headers = { 'X-Orbit-Client': '1' };
  assert.equal((await call('/api/scanner/session', { headers: { ...headers, Origin: 'https://evil.test' } })).status, 403);
  const response = await call('/api/scanner/session', { headers });
  assert.equal(response.headers.get('Access-Control-Allow-Origin'), null);
  const { token } = await response.json(); assert.equal(token.length, 64);
  assert.equal((await call('/api/scanner/status', { headers })).status, 401);
  assert.equal((await call('/api/scanner/status', { headers: { ...headers, 'X-Orbit-Session': 'é'.repeat(64) } })).status, 401);
  headers['X-Orbit-Session'] = token;
  assert.equal((await call('/api/scanner/status', { headers })).status, 200);
  assert.equal((await call('/api/scanner/scan', { method: 'POST', headers, body: '{"command":"bad"}' })).status, 400);
  const { id } = await (await call('/api/scanner/scan', { method: 'POST', headers })).json();
  await scanner.operation;
  const result = await call(`/api/scanner/scan/${id}/result`, { headers }); assert.equal(result.status, 200);
  assert.equal((await result.json()).metadata, undefined);
  assert.equal((await call(`/api/scanner/scan/${id}`, { method: 'DELETE', headers })).status, 200);
  assert.equal((await call(`/api/scanner/scan/${id}/result`, { headers })).status, 409);
  assert.equal((await call('/api/scanner/scan', { method: 'OPTIONS', headers })).status, 404);
});
