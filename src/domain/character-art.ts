import data from '../data/character-art.json';

export const CHARACTER_ART_PIN = data.pin;
const characters: Record<string, { name: string; portrait: string }> = data.characters;
export function characterArtwork(id: string) {
  if (!Object.hasOwn(characters, id)) return null;
  const character = characters[id];
  return { name: character.name, url: `https://raw.githubusercontent.com/Mar-7th/StarRailRes/${CHARACTER_ART_PIN}/${character.portrait}` };
}
