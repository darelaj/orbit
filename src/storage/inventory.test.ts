import 'fake-indexeddb/auto';
import { expect, test, vi } from 'vitest';
import { loadInventory, openWorkspace, saveInventory } from './inventory';
import { parseInventory } from '../domain/inventory';
import fixture from '../../tests/fixtures/character-export.json';

test('inventory survives a storage round-trip and an aborted replacement retains the old record', async () => {
  const old = parseInventory(JSON.stringify({ ...fixture, source: 'HSR-Scanner' }));
  await saveInventory(old);
  expect(await loadInventory()).toEqual(old);
  const put = vi.spyOn(IDBObjectStore.prototype, 'put').mockImplementation(function(this: IDBObjectStore) {
    this.transaction.abort();
    throw new DOMException('Quota exceeded', 'QuotaExceededError');
  });
  await expect(saveInventory({ ...old, source: 'reliquary_archiver', precision: 'packet' })).rejects.toThrow();
  put.mockRestore();
  expect(await loadInventory()).toEqual(old);
});

test('schema-1 storage migrates on explicit save, and invalid progression cannot overwrite it', async () => {
  const legacy = JSON.stringify({ format: 'orbit-inventory', schemaVersion: 1, scanner: { source: 'HSR-Scanner', version: 4, relics: [], characters: [{ id: '1308', name: 'Legacy' }] } });
  const db = await openWorkspace();
  await new Promise<void>((resolve, reject) => {
    const transaction = db.transaction('workspace', 'readwrite');
    transaction.objectStore('workspace').put(legacy, 'inventory');
    transaction.oncomplete = () => resolve();
    transaction.onabort = transaction.onerror = () => reject(new Error('Fixture storage failed'));
  });
  const restored = await loadInventory();
  expect(restored?.roster.source).toBe('legacy-backup');
  expect(restored?.characters[0].progression).toBeUndefined();
  await saveInventory(restored!);
  const stored = await new Promise<string>((resolve, reject) => {
    const request = db.transaction('workspace').objectStore('workspace').get('inventory');
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(new Error('Fixture read failed'));
  });
  db.close();
  expect(JSON.parse(stored).schemaVersion).toBe(2);
  expect(await loadInventory()).toEqual(restored);
  const invalid = { ...restored!, characters: [{ id: '1308', name: 'Invalid', progression: { level: 81 } }] };
  await expect(saveInventory(invalid)).rejects.toThrow('characters[0].level');
  expect(await loadInventory()).toEqual(restored);
});
