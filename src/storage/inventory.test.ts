import 'fake-indexeddb/auto';
import { expect, test, vi } from 'vitest';
import { loadInventory, saveInventory } from './inventory';
import { parseInventory } from '../domain/inventory';

test('inventory survives a storage round-trip and an aborted replacement retains the old record', async () => {
  const old = parseInventory(JSON.stringify({ source: 'HSR-Scanner', version: 4, relics: [] }));
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
