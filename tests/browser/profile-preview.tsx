import {createRoot} from 'react-dom/client';
import {IDBFactory} from 'fake-indexeddb';
import ComparisonWorkspace from '../../src/features/comparison/ComparisonWorkspace';
import {parseInventory} from '../../src/domain/inventory';
import raw from '../fixtures/character-export.json';
import '../../src/app/styles.css';
import '../../src/app/fonts.css';

// Keep browser QA isolated from the owner's durable workspace.
Object.defineProperty(globalThis,'indexedDB',{value:new IDBFactory()});
const sample=structuredClone(raw);
const traces=sample.characters[0].traces!;
for(const key of Object.keys(traces))if(key!=='secret')Reflect.set(traces,key,false);
const inventory=parseInventory(JSON.stringify(sample));
createRoot(document.getElementById('root')!).render(<main className="app-shell"><h1>Synthetic profile QA — memory only</h1><button onClick={()=>{document.documentElement.dataset.theme=document.documentElement.dataset.theme==='light'?'dark':'light';}}>QA theme</button><ComparisonWorkspace inventory={inventory}/></main>);
