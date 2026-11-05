import setData from '../data/relic-sets.json';
import { catalogueItem, mainStatValue } from './catalogue';
import { inventorySlots, type InventoryRelic, type InventorySlot } from './inventory';

export const statKeys = ['HP','ATK','DEF','SPD','HP_','ATK_','DEF_','SPD_','CRIT Rate_','CRIT DMG_','Effect Hit Rate_','Effect RES_','Break Effect_','Energy Regeneration Rate_','Outgoing Healing Boost_','Physical DMG Boost_','Fire DMG Boost_','Ice DMG Boost_','Lightning DMG Boost_','Wind DMG Boost_','Quantum DMG Boost_','Imaginary DMG Boost_','Elation DMG Boost_'] as const;
export type StatKey = typeof statKeys[number];
export type BuildProfile = { name: string; base: {HP:number; ATK:number; DEF:number; SPD:number}; cone: {HP:number; ATK:number; DEF:number}; corrections: Partial<Record<StatKey,number>> };
export type Loadout = Partial<Record<InventorySlot, InventoryRelic>>;
export type Comparison = { name: string; profile: BuildProfile; a: Loadout; b: Loadout; precision: 'packet' | 'ocr' | 'unknown' };
export const emptyProfile: BuildProfile = { name:'', base:{HP:0,ATK:0,DEF:0,SPD:0}, cone:{HP:0,ATK:0,DEF:0}, corrections:{} };
type SetInfo = {name:string; desc:string[]; properties:{type:string;value:number}[][]};
const sets: Record<string,SetInfo> = setData;
const propertyKeys: Record<string,StatKey> = {
  HPAddedRatio:'HP_', AttackAddedRatio:'ATK_', DefenceAddedRatio:'DEF_', SpeedAddedRatio:'SPD_', CriticalChanceBase:'CRIT Rate_', CriticalDamageBase:'CRIT DMG_',
  StatusProbabilityBase:'Effect Hit Rate_', StatusResistanceBase:'Effect RES_', BreakDamageAddedRatioBase:'Break Effect_', SPRatioBase:'Energy Regeneration Rate_', HealRatioBase:'Outgoing Healing Boost_',
  PhysicalAddedRatio:'Physical DMG Boost_', FireAddedRatio:'Fire DMG Boost_', IceAddedRatio:'Ice DMG Boost_', ThunderAddedRatio:'Lightning DMG Boost_', WindAddedRatio:'Wind DMG Boost_', QuantumAddedRatio:'Quantum DMG Boost_', ImaginaryAddedRatio:'Imaginary DMG Boost_', ElationDamageAddedRatioBase:'Elation DMG Boost_',
};
export function validateProfile(profile: BuildProfile) {
  if (!profile.name.trim() || profile.name.length > 100) throw new Error('Enter a character/profile name (up to 100 characters).');
  for (const value of [...Object.values(profile.base), ...Object.values(profile.cone), ...Object.values(profile.corrections)]) if (typeof value !== 'number' || !Number.isFinite(value) || Math.abs(value) > 1000000) throw new Error('Profile values must be finite numbers within ±1,000,000.');
  if (Object.values(profile.base).some(v=>v<0) || Object.values(profile.cone).some(v=>v<0) || profile.base.SPD <= 0) throw new Error('Base stats must be nonnegative, with character SPD above zero.');
}
export function equippedLoadout(relics: InventoryRelic[], owner: string): Loadout {
  const result: Loadout = {};
  if (!owner) return result;
  for (const relic of relics.filter(r=>r.location===owner)) {
    if (result[relic.slot]) throw new Error(`Multiple equipped relics for ${relic.slot}. Choose slots manually.`);
    result[relic.slot] = structuredClone(relic);
  }
  return result;
}
export function calculateBuild(profile: BuildProfile, loadout: Loadout) {
  validateProfile(profile);
  const additions = Object.fromEntries(statKeys.map(k=>[k,profile.corrections[k] ?? 0])) as Record<StatKey,number>;
  const counts = new Map<string,number>(); const warnings:string[]=[];
  const used = new Set<string>();
  for (const slot of inventorySlots) {
    const relic = loadout[slot];
    if (!relic) { warnings.push(`${slot}: empty slot; totals are partial.`); continue; }
    if (relic.slot !== slot) throw new Error(`Wrong relic slot: ${slot}`);
    if (used.has(relic.id)) throw new Error(`Duplicate relic ID: ${relic.id}`);
    used.add(relic.id);
    if (sets[relic.setId] && !catalogueItem(relic)) throw new Error(`Set ${relic.setId} is incompatible with ${slot}.`);
    const main = mainStatValue(relic);
    if (!main) throw new Error(`Main stat unavailable for ${slot}.`);
    const key = (main.percent ? `${relic.mainStat}_` : relic.mainStat) as StatKey;
    if (!statKeys.includes(key)) throw new Error(`Unsupported main stat ${key}`);
    additions[key] += main.value;
    for (const stat of relic.substats) {
      if (!statKeys.includes(stat.key as StatKey)) throw new Error(`Unsupported substat ${stat.key}`);
      additions[stat.key as StatKey] += stat.value;
    }
    counts.set(relic.setId,(counts.get(relic.setId)??0)+1);
  }
  const activeSets: {id:string;name:string;pieces:number;description:string;applied:string[]}[]=[];
  for (const [id,count] of counts) {
    const info=sets[id];
    if (!info) { warnings.push(`Unknown set ${id}: no bonus applied.`); continue; }
    for (const [i,description] of info.desc.entries()) {
      const threshold=Number(id)>=300 ? 2 : (i+1)*2;
      if (count<threshold) continue;
      const applied:string[]=[];
      for (const property of info.properties[i]??[]) {
        const key=propertyKeys[property.type];
        if (!key) { warnings.push(`Unsupported set property ${property.type}`); continue; }
        additions[key]+=property.value*100;
        applied.push(`${key.replace('_',' %')}: ${property.value*100}`);
      }
      activeSets.push({id,name:info.name,pieces:threshold,description,applied});
    }
  }
  const totals={...additions};
  for (const key of ['HP','ATK','DEF'] as const) totals[key]=(profile.base[key]+profile.cone[key])*(1+additions[`${key}_`]/100)+additions[key];
  totals.SPD=profile.base.SPD*(1+additions.SPD_/100)+additions.SPD;
  if(Object.values(totals).some(value=>!Number.isFinite(value)))throw new Error('Calculated stat overflow. Check imported values and profile.');
  if (totals.SPD<=0) throw new Error('Calculated SPD must remain above zero.');
  if (totals.HP<0 || totals.ATK<0 || totals.DEF<0) throw new Error('Calculated HP, ATK and DEF cannot be negative.');
  return {totals,activeSets,warnings};
}
