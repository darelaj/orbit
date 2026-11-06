import { useEffect, useRef, useState } from 'react';
import { parseInventory, type Inventory } from '../../domain/inventory';
import { decodeScannerStatus, scanIsBusy, scannerRequest, scannerSession, type ScannerStatus } from './scanner-api';

export default function ScannerPanel({ disabled, onPreview, onBusy }: { disabled: boolean; onPreview: (inventory: Inventory) => void; onBusy: (busy: boolean) => void }) {
  const [runtime, setRuntime] = useState<ScannerStatus | null>(null);
  const [connection, setConnection] = useState<'connecting' | 'connected' | 'offline'>('connecting');
  const [reconnect, setReconnect] = useState(0);
  const [acting, setActing] = useState(false);
  const [error, setError] = useState('');
  const [reviewedId, setReviewedId] = useState('');
  const callbacks = useRef({ onPreview, onBusy }); callbacks.current = { onPreview, onBusy };
  const controller = useRef<AbortController | null>(null);
  const token = useRef('');
  const revision = useRef(0);
  const actionPending = useRef(false);
  const pollAfterAction = useRef(() => {});
  const busy = acting || scanIsBusy(runtime?.job?.state);
  useEffect(() => { callbacks.current.onBusy(busy); }, [busy]);
  useEffect(() => () => callbacks.current.onBusy(false), []);
  useEffect(() => {
    const abort = new AbortController(); controller.current = abort; token.current = ''; revision.current++;
    let timer: ReturnType<typeof setTimeout>;
    setConnection('connecting'); setRuntime(null); setError(''); setReviewedId('');
    async function refresh() {
      if (actionPending.current) { timer = setTimeout(() => void refresh(), 1000); return; }
      const current = revision.current;
      try {
        if (!token.current) token.current = await scannerSession(abort.signal);
        const next = decodeScannerStatus(await (await scannerRequest('status', abort.signal, token.current)).json());
        if (abort.signal.aborted) return;
        if (current !== revision.current) return;
        setRuntime(next); setConnection('connected');
        timer = setTimeout(() => void refresh(), scanIsBusy(next.job?.state) || next.job?.state === 'ready' ? 1000 : 5000);
      } catch {
        if (!abort.signal.aborted) { setRuntime(null); setConnection('offline'); token.current = ''; }
      }
    }
    pollAfterAction.current = () => { clearTimeout(timer); timer = setTimeout(() => void refresh(), 1000); };
    void refresh();
    return () => { abort.abort(); clearTimeout(timer); };
  }, [reconnect]);
  async function act(kind: 'start' | 'cancel' | 'review') {
    const abort = controller.current;
    if (!abort || abort.signal.aborted || !token.current || actionPending.current) return;
    actionPending.current = true; revision.current++; setActing(true); setError(''); setReviewedId('');
    try {
      if (kind === 'start') await scannerRequest('scan', abort.signal, token.current, 'POST');
      else if (runtime?.job) {
        const path = `scan/${runtime.job.id}`;
        if (kind === 'review') {
          const result = parseInventory(await (await scannerRequest(`${path}/result`, abort.signal, token.current)).text());
          await scannerRequest(path, abort.signal, token.current, 'DELETE');
          if (!abort.signal.aborted) { callbacks.current.onPreview(result); setReviewedId(runtime.job.id); }
        } else await scannerRequest(path, abort.signal, token.current, 'DELETE');
      }
      const next = decodeScannerStatus(await (await scannerRequest('status', abort.signal, token.current)).json());
      if (!abort.signal.aborted) setRuntime(next);
    } catch (reason) {
      if (!abort.signal.aborted) setError(reason instanceof Error ? reason.message : 'Scanner request failed. Reconnect and retry.');
    } finally { actionPending.current = false; if (!abort.signal.aborted) { setActing(false); pollAfterAction.current(); } }
  }
  return <div className="scanner-content">
    <p>Read equipped and stored relics through Orbit's integrated Windows scanner. Your saved inventory changes only after you review and confirm the result.</p>
    <ol><li>Open HSR and stay on the <strong>Click to Start</strong> screen.</li><li>Choose <strong>Scan inventory</strong> and approve the Windows Administrator request. Enter the game when Orbit says the scanner is listening.</li></ol>
    <p className="fineprint">The web server stays under your normal user. Only the native reader requests elevation. A scan listens for up to 120 seconds; game-version support depends on the scanner engine.</p>
    {connection === 'connecting' ? <p role="status">Connecting to the local scanner runtime…</p> : connection === 'offline' ? <div className="scanner-feedback"><p>Scanner runtime unavailable. Stop the dev or preview server, run <code>npm.cmd start</code> from the Orbit folder, then reconnect here.</p><button onClick={() => setReconnect(value => value + 1)}>Reconnect scanner</button></div> : runtime && <>
      {!runtime.supported ? <p>Integrated scanning requires Windows x64. Use JSON import on this device.</p> : !runtime.installed ? <p>Scanner engine unavailable. Stop Orbit, run <code>npm.cmd run scanner:setup</code>, then <code>npm.cmd start</code>. Reconnect after startup.</p> : null}
      <p className="scanner-state" role={runtime.job?.state === 'failed' ? 'alert' : 'status'}>{reviewedId === runtime.job?.id && runtime.job?.state === 'cancelled' ? 'Scan received and validated.' : runtime.job?.message || `Scanner ready · Reliquary ${runtime.engineVersion}. No scan started.`}</p>
      <div className="scanner-actions">
        <button className="primary" disabled={disabled || busy || !runtime.supported || !runtime.installed} onClick={() => void act('start')}>Scan inventory</button>
        {runtime.job?.state === 'ready' && <button disabled={disabled || acting} onClick={() => void act('review')}>Review scan</button>}
        {runtime.job && (scanIsBusy(runtime.job.state) || runtime.job.state === 'ready') && <button disabled={acting || runtime.job.state === 'discarding'} onClick={() => void act('cancel')}>Discard scan</button>}
        {!busy && <button disabled={acting} onClick={() => setReconnect(value => value + 1)}>Reconnect scanner</button>}
      </div>
      {scanIsBusy(runtime.job?.state) && <p className="fineprint">Discarding drops the result and waits for the native process to finish. Closing this panel does not stop a scan.</p>}
    </>}
    {disabled && <p>Wait for the current import or finish its preview before scanning.</p>}
    {error && <p role="alert">{error}</p>}
  </div>;
}
