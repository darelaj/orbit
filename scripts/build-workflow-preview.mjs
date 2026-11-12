import {build} from 'vite';
import {resolve} from 'node:path';
import {access} from 'node:fs/promises';

// Build the isolated, memory-only acceptance fixture with a real bundled Worker.
const entry='tests/browser/build-workflow-preview.html';
const outDir='.cache/o11h-production';
await build({build:{outDir,rolldownOptions:{input:resolve(entry)}}});
await access(resolve(outDir,entry));
