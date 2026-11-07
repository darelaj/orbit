import { type BuildProfile, type Comparison, type Loadout, statKeys, validateProfile } from '../domain/comparison';
import { backupInventory, parseInventory, type Inventory } from '../domain/inventory';
import { CATALOGUE_PIN } from '../domain/catalogue';
import { openWorkspace } from './inventory';

function object(value:unknown):Record<string,unknown> {
  if (!value || typeof value!=='object' || Array.isArray(value)) throw new Error('Invalid comparison snapshot.');
  return value as Record<string,unknown>;
}
function profileFrom(value:unknown):BuildProfile {
  const raw=object(value); const base=object(raw.base); const cone=object(raw.cone); const corrections=object(raw.corrections);
  if (typeof raw.name!=='string') throw new Error('Invalid profile name.');
  function number(value:unknown):number { if (typeof value!=='number' || !Number.isFinite(value)) throw new Error('Invalid profile number.'); return value; }
  const manual:BuildProfile={name:raw.name,base:{HP:number(base.HP),ATK:number(base.ATK),DEF:number(base.DEF),SPD:number(base.SPD)},cone:{HP:number(cone.HP),ATK:number(cone.ATK),DEF:number(cone.DEF)},corrections:{}};
  for (const [key,value] of Object.entries(corrections)) {
    if (!statKeys.includes(key as typeof statKeys[number])) throw new Error('Unsupported manual stat.');
    manual.corrections[key as typeof statKeys[number]]=number(value);
  }
  if (raw.origin !== undefined) {
    const origin = object(raw.origin);
    if (typeof origin.characterId !== 'string' || typeof origin.cataloguePin !== 'string' || typeof origin.key !== 'string' || (origin.mode !== 'baseline' && origin.mode !== 'edited') || !Array.isArray(origin.notes) || origin.notes.some(n => typeof n !== 'string')) throw new Error('Invalid profile provenance.');
    manual.origin = { characterId: origin.characterId, cataloguePin: origin.cataloguePin, key: origin.key, mode: origin.mode, notes: origin.notes };
  }
  validateProfile(manual); return manual;
}
function snapshot(loadout:Loadout,precision:Comparison['precision']):string {
  const inventory:Inventory={source:precision==='packet'?'reliquary_archiver':'HSR-Scanner',version:4,precision:precision==='packet'?'packet':'ocr',relics:Object.values(loadout),importedAt:null,characters:[],lightCones:[],roster:{source:'omitted',completeness:'unknown'},lightConeSource:'omitted'};
  return backupInventory(inventory);
}
function loadoutFrom(value:unknown):Loadout {
  if (typeof value!=='string') throw new Error('Invalid relic snapshot.');
  const relics=parseInventory(value).relics; const loadout:Loadout={};
  for (const relic of relics) { if (loadout[relic.slot]) throw new Error('Duplicate snapshot slot.'); loadout[relic.slot]=relic; }
  return loadout;
}
export function encodeComparisons(comparisons:Comparison[]):string {
  if (comparisons.length>20) throw new Error('Up to 20 saved comparisons are supported.');
  return JSON.stringify({schemaVersion:1,cataloguePin:CATALOGUE_PIN,items:comparisons.map(c=>({name:c.name,profile:c.profile,precision:c.precision,a:snapshot(c.a,c.precision),b:snapshot(c.b,c.precision)}))});
}
export function decodeComparisons(text:string):Comparison[] {
  const raw=object(JSON.parse(text));
  if (raw.schemaVersion!==1 || raw.cataloguePin!==CATALOGUE_PIN || !Array.isArray(raw.items) || raw.items.length>20) throw new Error('Unsupported comparison storage version or catalogue.');
  const names=new Set<string>();
  return raw.items.map(value=>{
    const c=object(value);
    if (typeof c.name!=='string' || !c.name.trim() || c.name.length>100 || !['packet','ocr','unknown'].includes(String(c.precision))) throw new Error('Invalid comparison metadata.');
    if (names.has(c.name)) throw new Error('Duplicate comparison name.');
    names.add(c.name);
    return {name:c.name,profile:profileFrom(c.profile),precision:c.precision as Comparison['precision'],a:loadoutFrom(c.a),b:loadoutFrom(c.b)};
  });
}
export async function loadComparisons():Promise<Comparison[]> {
  const db=await openWorkspace();
  try {
    const raw=await new Promise<unknown>((resolve,reject)=>{const request=db.transaction('workspace').objectStore('workspace').get('comparisons'); request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(new Error('Could not read saved comparisons.'));});
    if (raw===undefined) return [];
    if (typeof raw!=='string') throw new Error('Invalid comparison storage.');
    return decodeComparisons(raw);
  } finally { db.close(); }
}
export async function saveComparisons(comparisons:Comparison[]):Promise<void> {
  const text=encodeComparisons(comparisons); decodeComparisons(text);
  const db=await openWorkspace();
  try { await new Promise<void>((resolve,reject)=>{ const tx=db.transaction('workspace','readwrite'); tx.objectStore('workspace').put(text,'comparisons');tx.oncomplete=()=>resolve();tx.onerror=tx.onabort=()=>reject(new Error('Could not save comparisons. Previous snapshots are unchanged.')); }); }
  finally { db.close(); }
}
