import { createServer } from 'node:http';
import { randomBytes, timingSafeEqual } from 'node:crypto';
import { readFile, realpath } from 'node:fs/promises';
import { resolve, sep, extname } from 'node:path';

export function createOrbitServer({ scanner, dist }) {
  const token = randomBytes(32).toString('hex');
  const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' };
  const server = createServer(async (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');
    res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'self'; worker-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'");
    const json = (code, value) => { res.writeHead(code, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(value)); };
    const expectedHost = `127.0.0.1:${server.address()?.port}`;
    const origin = `http://${expectedHost}`;
    if (req.headers.host !== expectedHost || (req.headers.origin && req.headers.origin !== origin) || req.headers['sec-fetch-site'] === 'cross-site') return json(403, { error: 'Use the Orbit page on 127.0.0.1 with the same port.' });
    let path;
    try { path = decodeURIComponent((req.url ?? '').split('?')[0]); } catch { return json(400, { error: 'Invalid path.' }); }
    if (path.includes('\\') || path.includes('\0') || path.split('/').some(part => part === '..' || part === '.')) return json(403, { error: 'Invalid path.' });
    if (path.startsWith('/api/')) {
      if (req.headers['x-orbit-client'] !== '1') return json(403, { error: 'Open the scanner from Orbit.' });
      if (req.headers['transfer-encoding'] || (req.headers['content-length'] && req.headers['content-length'] !== '0')) {
        res.setHeader('Connection', 'close'); return json(400, { error: 'Scanner commands do not accept a request body.' });
      }
      if (path === '/api/scanner/session' && req.method === 'GET') return json(200, { token });
      const supplied = req.headers['x-orbit-session'];
      if (typeof supplied !== 'string' || Buffer.byteLength(supplied) !== Buffer.byteLength(token) || !timingSafeEqual(Buffer.from(supplied), Buffer.from(token))) return json(401, { error: 'Scanner session expired. Reconnect from Orbit.' });
      try {
        if (path === '/api/scanner/status' && req.method === 'GET') return json(200, await scanner.status());
        if (path === '/api/scanner/scan' && req.method === 'POST') return json(202, scanner.start());
        const match = /^\/api\/scanner\/scan\/([0-9a-f-]{36})(\/result)?$/.exec(path);
        if (match && match[2] && req.method === 'GET') {
          const result = scanner.result(match[1]);
          res.writeHead(200, { 'Content-Type': 'application/json' }); res.end(result); return;
        }
        if (match && !match[2] && req.method === 'DELETE') { scanner.cancel(match[1]); return json(200, { cancelled: true }); }
      } catch (error) { return json(409, { error: error.message }); }
      return json(404, { error: 'Unknown scanner command.' });
    }
    if (req.method !== 'GET' && req.method !== 'HEAD') return json(405, { error: 'Method not allowed.' });
    try {
      const root = await realpath(dist);
      const file = await realpath(resolve(root, path === '/' ? 'index.html' : `.${path}`));
      if (!file.startsWith(root + sep)) return json(403, { error: 'Invalid path.' });
      const bytes = await readFile(file);
      res.writeHead(200, { 'Content-Type': types[extname(file)] ?? 'application/octet-stream' });
      res.end(req.method === 'HEAD' ? undefined : bytes);
    } catch { return json(404, { error: 'File unavailable. Build Orbit with npm run build first.' }); }
  });
  server.requestTimeout = 10000; server.headersTimeout = 10000;
  return server;
}
