import { mkdir, writeFile } from 'node:fs/promises';

const pin = 'dbe8cdfcfb0bf657b9fe1cf92d5537f118ccb487';
const names = ['characters', 'character_promotions', 'character_skill_trees', 'light_cones', 'light_cone_promotions'];
const sources = await Promise.all(names.map(async name => {
  const response = await fetch(`https://raw.githubusercontent.com/Mar-7th/StarRailRes/${pin}/index_new/en/${name}.json`);
  if (!response.ok) throw new Error(`${name}: ${response.status}`);
  return response.json();
}));
const [characters, promotions, trees, cones, conePromotions] = sources;
const fields = { Point06: 'ability_1', Point07: 'ability_2', Point08: 'ability_3', Point09: 'stat_1', Point10: 'stat_2', Point11: 'stat_3', Point12: 'stat_4', Point13: 'stat_5', Point14: 'stat_6', Point15: 'stat_7', Point16: 'stat_8', Point17: 'stat_9', Point18: 'stat_10' };
const paths = { Knight: 'Preservation', Rogue: 'Hunt', Mage: 'Erudition', Warlock: 'Nihility', Warrior: 'Destruction', Shaman: 'Harmony', Priest: 'Abundance', Memory: 'Remembrance', Elation: 'Elation' };
const selected = Object.fromEntries(['1001', '1101', '1308'].map(id => {
  const character = characters[id];
  const nodes = character.skill_trees.map(key => trees[key]).filter(node => fields[node.anchor]);
  if (nodes.length !== 13 || new Set(nodes.map(node => node.anchor)).size !== 13) throw new Error(`Unreviewed Trace layout ${id}`);
  const traces = nodes.map(node => ({ id: node.id, field: fields[node.anchor], promotion: node.levels[0].promotion, level: node.levels[0].level, parents: node.pre_points, properties: node.levels[0].properties }));
  if (traces.some(node => node.parents.some(parent => !traces.some(p => p.id === parent)))) throw new Error(`Unmapped prerequisite ${id}`);
  return [id, { name: character.name, path: paths[character.path], values: promotions[id].values, traces }];
}));
const lightCones = Object.fromEntries(Object.entries(cones).map(([id, cone]) => [id, { name: cone.name, path: paths[cone.path], values: conePromotions[id].values }]));
await mkdir('src/data', { recursive: true });
await writeFile('src/data/stat-profiles.json', JSON.stringify({ pin, sources: names, characters: selected, lightCones }) + '\n');
console.log(`Pinned ${Object.keys(selected).length} reviewed baseline characters and ${Object.keys(lightCones).length} Light Cone base progressions at ${pin}`);
