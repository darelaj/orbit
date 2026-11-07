import data from '../data/stat-profiles.json';
import { characterDataStatus, type CharacterTraces, type Inventory } from './inventory';
import { propertyKeys, validateProfile, type BuildProfile } from './comparison';

type Growth = Record<string, { base: number; step: number }>;
type Trace = { id: string; field: string; promotion: number; level: number; parents: string[]; properties: { type: string; value: number }[] };
type CharacterData = { name: string; path: string; values: Growth[]; traces: Trace[] };
type ConeData = { name: string; path: string; values: Growth[] };
const characters: Record<string, CharacterData> = data.characters;
const cones: Record<string, ConeData> = data.lightCones;
export const PROFILE_PIN = data.pin;

function growth(values: Growth[], level: number | undefined, ascension: number | undefined, label: string) {
  const lower = [1, 20, 30, 40, 50, 60, 70]; const upper = [20, 30, 40, 50, 60, 70, 80];
  if (level === undefined || ascension === undefined || !Number.isInteger(level) || !Number.isInteger(ascension) || ascension < 0 || ascension > 6 || level < lower[ascension] || level > upper[ascension]) throw new Error(`${label}: missing, unresolved or inconsistent level/ascension. Reimport or complete a manual profile.`);
  const row = values[ascension];
  function stat(key: string) {
    const property = row?.[key];
    if (!property || !Number.isFinite(property.base) || !Number.isFinite(property.step)) throw new Error(`${label}: catalogue stat ${key} unavailable.`);
    return property.base + (level! - 1) * property.step;
  }
  return stat;
}

export function resolveCharacterProfile(inventory: Inventory, owner: string, options: { baselineKit: boolean; lightCone: string }): { profile: BuildProfile | null; issues: string[] } {
  try {
    const character = inventory.characters.find(c => c.id === owner);
    if (!character) throw new Error('Character is absent from the supplied roster. Select a roster entry or use a manual profile.');
    const info = characters[character.id];
    if (!info) throw new Error('This character/form has no reviewed automatic profile yet. Use a manual profile.');
    if (characterDataStatus(character) !== 'unverified') throw new Error('Profile incomplete: reimport progression or use a manual profile.');
    const p = character.progression!;
    if (p.path !== info.path) throw new Error('Character Path does not match the pinned form. Use a manual profile.');
    if (!options.baselineKit) throw new Error('Confirm Use pinned baseline kit before initializing catalogue stats. Imported kit versions are not automatically mapped.');
    if (p.traces?.special || Object.values(p.skills ?? {}).every(v => v === 0)) throw new Error('Special or unresolved kit data requires a manual profile.');
    const stat = growth(info.values, p.level, p.ascension, 'Character');
    const profile: BuildProfile = { name: info.name, base: { HP: stat('hp'), ATK: stat('atk'), DEF: stat('def'), SPD: stat('spd') }, cone: { HP: 0, ATK: 0, DEF: 0 }, corrections: { 'CRIT Rate_': stat('crit_rate') * 100, 'CRIT DMG_': stat('crit_dmg') * 100, 'Energy Regeneration Rate_': 100 } };
    for (const node of info.traces) {
      if (!p.traces?.[node.field as keyof CharacterTraces]) continue;
      if (p.level! < node.level || p.ascension! < node.promotion || node.parents.some(id => !p.traces?.[info.traces.find(n => n.id === id)!.field as keyof CharacterTraces])) throw new Error(`Trace ${node.field} conflicts with its progression or prerequisites. Use a manual profile.`);
      for (const property of node.properties) {
        const key = propertyKeys[property.type];
        if (!key) throw new Error(`Trace property ${property.type} is not modeled.`);
        profile.corrections[key] = (profile.corrections[key] ?? 0) + property.value * 100;
      }
    }
    const notes = ['Pinned baseline kit model explicitly selected; imported ability version is retained, not interpreted. Enhanced kits may differ.', 'Only baseline stats and unlocked minor Trace properties are included. Major Trace effects, Eidolon bonuses, Light Cone passives, combat buffs and conversions are excluded.'];
    if (!['equipped', 'none'].includes(options.lightCone) && !options.lightCone.startsWith('owned:')) throw new Error('Choose an equipped, owned or explicit No Light Cone option.');
    const equipped = inventory.lightCones.filter(c => c.location === owner);
    const cone = options.lightCone === 'none' ? undefined : options.lightCone === 'equipped' ? equipped.length === 1 ? equipped[0] : undefined : inventory.lightCones.find(c => c.uid === options.lightCone.slice(6));
    if (options.lightCone !== 'none') {
      if (!cone) throw new Error('Equipped Light Cone is missing or ambiguous. Choose an owned Light Cone or explicitly select No Light Cone.');
      const coneData = cones[cone.id];
      if (!coneData || cone.superimposition === undefined) throw new Error('Light Cone data is incomplete or absent from the pinned catalogue. Use a manual profile.');
      const coneStat = growth(coneData.values, cone.level, cone.ascension, 'Light Cone');
      profile.cone = { HP: coneStat('hp'), ATK: coneStat('atk'), DEF: coneStat('def') };
      if (coneData.path !== info.path) notes.push('Light Cone Path mismatch: base stats apply; its passive is not applied.');
      if (options.lightCone !== 'equipped') notes.push('Hypothetical Light Cone selection; this does not equip it in game.');
    } else notes.push('No Light Cone explicitly selected; this is a hypothetical equipment choice.');
    profile.origin = { characterId: character.id, cataloguePin: PROFILE_PIN, key: JSON.stringify([character.id, p, options.lightCone, cone ?? null]), mode: 'baseline', notes };
    validateProfile(profile);
    return { profile, issues: [] };
  } catch (error) {
    return { profile: null, issues: [error instanceof Error ? error.message : 'Profile unavailable. Use a manual profile.'] };
  }
}
