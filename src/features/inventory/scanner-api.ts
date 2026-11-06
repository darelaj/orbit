export const scanStates = ['permission', 'starting', 'capturing', 'discarding', 'ready', 'failed', 'cancelled', 'expired'] as const;
export type ScanState = typeof scanStates[number];
export type ScannerStatus = { supported: boolean; installed: boolean; engineVersion: string; job: null | { id: string; state: ScanState; message: string } };
export function scanIsBusy(state: ScanState | undefined) { return state !== undefined && ['permission', 'starting', 'capturing', 'discarding'].includes(state); }
function object(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Invalid scanner response. Reconnect to Orbit.');
  return value as Record<string, unknown>;
}
export function decodeScannerStatus(value: unknown): ScannerStatus {
  const raw = object(value);
  if (typeof raw.supported !== 'boolean' || typeof raw.installed !== 'boolean' || typeof raw.engineVersion !== 'string') throw new Error('Invalid scanner status.');
  let job: ScannerStatus['job'] = null;
  if (raw.job !== null) {
    const item = object(raw.job);
    if (typeof item.id !== 'string' || !/^[0-9a-f-]{36}$/.test(item.id) || !scanStates.includes(item.state as ScanState) || typeof item.message !== 'string' || item.message.length > 1000) throw new Error('Invalid scan state.');
    job = { id: item.id, state: item.state as ScanState, message: item.message };
  }
  return { supported: raw.supported, installed: raw.installed, engineVersion: raw.engineVersion, job };
}
export async function scannerRequest(path: string, signal: AbortSignal, token?: string, method = 'GET'): Promise<Response> {
  const response = await fetch(`/api/scanner/${path}`, { method, signal, cache: 'no-store', headers: { 'X-Orbit-Client': '1', ...(token ? { 'X-Orbit-Session': token } : {}) } });
  if (!response.ok) {
    const raw = object(await response.json());
    throw new Error(typeof raw.error === 'string' ? raw.error : 'Scanner request failed. Reconnect and retry.');
  }
  return response;
}
export async function scannerSession(signal: AbortSignal): Promise<string> {
  const raw = object(await (await scannerRequest('session', signal)).json());
  if (typeof raw.token !== 'string' || !/^[a-f0-9]{64}$/.test(raw.token)) throw new Error('Invalid scanner session.');
  return raw.token;
}
