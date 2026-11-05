import { backupInventory, parseInventory, type Inventory } from '../domain/inventory';

function open(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('orbit-workspace', 1);
    request.onupgradeneeded = () => request.result.createObjectStore('workspace');
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(new Error('Could not open local inventory storage.'));
    request.onblocked = () => reject(new Error('Close other Orbit tabs, then try again.'));
  });
}
export async function loadInventory(): Promise<Inventory | null> {
  const db = await open();
  try {
    const text = await new Promise<unknown>((resolve, reject) => {
      const request = db.transaction('workspace').objectStore('workspace').get('inventory');
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(new Error('Could not read saved inventory.'));
    });
    if (text === undefined) return null;
    if (typeof text !== 'string') throw new Error('Saved inventory is invalid. Import a backup to recover.');
    return parseInventory(text);
  } finally { db.close(); }
}
export async function saveInventory(inventory: Inventory): Promise<void> {
  const text = backupInventory(inventory);
  const db = await open();
  try {
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction('workspace', 'readwrite');
      transaction.objectStore('workspace').put(text, 'inventory');
      transaction.oncomplete = () => resolve();
      transaction.onerror = transaction.onabort = () => reject(new Error('Inventory could not be saved. Previous inventory is unchanged. Check browser storage space.'));
    });
  } finally { db.close(); }
}
