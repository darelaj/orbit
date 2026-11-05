import { mkdir, writeFile } from 'node:fs/promises';
const pin = 'dbe8cdfcfb0bf657b9fe1cf92d5537f118ccb487';
const base = `https://raw.githubusercontent.com/Mar-7th/StarRailRes/${pin}/`;
await mkdir('src/data', { recursive: true });
await mkdir('public/assets/hsr/relic', { recursive: true });
async function get(path) {
  const response = await fetch(base + path);
  if (!response.ok) throw new Error(`${path}: ${response.status}`);
  return response;
}
const affixes = await (await get('index_new/en/relic_main_affixes.json')).json();
const relics = await (await get('index_new/en/relics.json')).json();
await writeFile('src/data/relic-main-affixes.json', JSON.stringify(affixes, null, 2) + '\n');
const slots = { HEAD: 'Head', HAND: 'Hands', BODY: 'Body', FOOT: 'Feet', NECK: 'Planar Sphere', OBJECT: 'Link Rope' };
const catalogue = Object.fromEntries(Object.values(relics).map(r => [`${r.set_id}:${slots[r.type]}`, { name: r.name, icon: r.icon.split('/').at(-1) }]));
await writeFile('src/data/relic-catalogue.json', JSON.stringify(catalogue, null, 2) + '\n');
const icons = [...new Set(Object.values(catalogue).map(r => r.icon))];
let cursor = 0;
await Promise.all(Array.from({ length: 8 }, async () => {
  while (cursor < icons.length) {
    const icon = icons[cursor++];
    await writeFile(`public/assets/hsr/relic/${icon}`, new Uint8Array(await (await get(`icon/relic/${icon}`)).arrayBuffer()));
  }
}));
console.log(`Pinned ${icons.length} relic icons and ${Object.keys(affixes).length} main-affix groups at ${pin}`);
