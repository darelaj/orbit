import { mkdir, writeFile } from 'node:fs/promises';
const pin = 'dbe8cdfcfb0bf657b9fe1cf92d5537f118ccb487';
const response = await fetch(`https://raw.githubusercontent.com/Mar-7th/StarRailRes/${pin}/index_new/en/characters.json`);
if (!response.ok) throw new Error(`Character metadata: ${response.status}`);
const raw = await response.json();
const characters = Object.fromEntries(Object.entries(raw).map(([id, character]) => {
  if (!/^\d+$/.test(id) || typeof character.name !== 'string' || !/^image\/character_portrait\/\d+\.png$/.test(character.portrait)) throw new Error(`Unsupported character artwork record ${id}`);
  return [id, { name: character.name, portrait: character.portrait }];
}));
await mkdir('src/data', { recursive: true });
await writeFile('src/data/character-art.json', JSON.stringify({ pin, characters }) + '\n');
console.log(`Mapped ${Object.keys(characters).length} remote character portraits; no image files downloaded.`);
