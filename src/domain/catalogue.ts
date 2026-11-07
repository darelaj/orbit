import affixData from '../data/relic-main-affixes.json';
import itemData from '../data/relic-catalogue.json';
import { inventorySlots, type InventoryRelic } from './inventory';

export const CATALOGUE_PIN = 'dbe8cdfcfb0bf657b9fe1cf92d5537f118ccb487';
const properties: Record<string, string> = {
  HP: 'HPAddedRatio', ATK: 'AttackAddedRatio', DEF: 'DefenceAddedRatio', SPD: 'SpeedDelta',
  'CRIT Rate': 'CriticalChanceBase', 'CRIT DMG': 'CriticalDamageBase', 'Outgoing Healing Boost': 'HealRatioBase',
  'Effect Hit Rate': 'StatusProbabilityBase', 'Energy Regeneration Rate': 'SPRatioBase', 'Break Effect': 'BreakDamageAddedRatioBase',
  ...Object.fromEntries(['Physical', 'Fire', 'Ice', 'Wind', 'Quantum', 'Imaginary'].map(s => [`${s} DMG Boost`, `${s}AddedRatio`])),
  'Lightning DMG Boost': 'ThunderAddedRatio',
};
type Affix = { property: string; base: number; step: number };
const affixes: Record<string, { affixes: Record<string, Affix> }> = affixData;
const items: Record<string, { name: string; icon: string }> = itemData;
export function catalogueItem(relic: InventoryRelic) { return items[`${relic.setId}:${relic.slot}`]; }
export function setKind(id: string): 'cavern' | 'planar' | null {
  if (inventorySlots.slice(0,4).some(slot => Object.hasOwn(items,`${id}:${slot}`))) return 'cavern';
  if (inventorySlots.slice(4).some(slot => Object.hasOwn(items,`${id}:${slot}`))) return 'planar';
  return null;
}
export function mainStatValue(relic: InventoryRelic): { value: number; percent: boolean } | undefined {
  const group = affixes[`${relic.rarity}${inventorySlots.indexOf(relic.slot) + 1}`];
  const property = relic.slot === 'Head' ? 'HPDelta' : relic.slot === 'Hands' ? 'AttackDelta' : properties[relic.mainStat];
  const affix = group && Object.values(group.affixes).find(a => a.property === property);
  if (!affix) return undefined;
  const percent = property !== 'HPDelta' && property !== 'AttackDelta' && property !== 'SpeedDelta';
  return { value: (affix.base + relic.level * affix.step) * (percent ? 100 : 1), percent };
}
export function formatMainStat(relic: InventoryRelic): string {
  const stat = mainStatValue(relic);
  return stat ? `${stat.value.toFixed(stat.percent ? 1 : 2)}${stat.percent ? '%' : ''}` : 'Catalogue value unavailable';
}
