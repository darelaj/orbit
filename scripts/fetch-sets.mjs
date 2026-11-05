import { writeFile } from 'node:fs/promises';
const pin = 'dbe8cdfcfb0bf657b9fe1cf92d5537f118ccb487';
const response = await fetch(`https://raw.githubusercontent.com/Mar-7th/StarRailRes/${pin}/index_new/en/relic_sets.json`);
if (!response.ok) throw new Error(`Set catalogue: ${response.status}`);
await writeFile('src/data/relic-sets.json', JSON.stringify(await response.json(), null, 2) + '\n');
