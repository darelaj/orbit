import {createRoot} from 'react-dom/client';
import {useEffect,useState} from 'react';
import {IDBFactory} from 'fake-indexeddb';
import ComparisonWorkspace from '../../src/features/comparison/ComparisonWorkspace';
import {inventorySlots,parseInventory} from '../../src/domain/inventory';
import raw from '../fixtures/character-export.json';
import '../../src/app/styles.css';
import '../../src/app/fonts.css';

// Synthetic browser acceptance never reads or replaces the owner's durable inventory.
Object.defineProperty(globalThis,'indexedDB',{value:new IDBFactory()});
const character=structuredClone(raw.characters[0]);
for(const key of Object.keys(character.traces!))if(key!=='secret')Reflect.set(character.traces!,key,false);
const fixed=inventorySlots.map((slot,i)=>({_uid:`current_${i}`,set_id:i<4?'101':'301',name:'Synthetic',slot,rarity:5,level:0,mainstat:i===1?'ATK':'HP',substats:[],location:'1308',lock:false,discard:false}));
const sample={...raw,characters:[character,{...character,id:'1001',name:'March 7th',path:'Preservation'},raw.characters[1]],relics:[...fixed,...[[33,160,''],[44,140,'1101']].map(([spd,crit,owner],i)=>({...fixed[1],_uid:`candidate_${i}`,substats:[{key:'SPD',value:spd},{key:'CRIT DMG_',value:crit}],location:owner}))]};
const initial=parseInventory(JSON.stringify(sample));
function Preview(){const [view,setView]=useState(location.hash);const [inventory,setInventory]=useState(initial);useEffect(()=>{const sync=()=>setView(location.hash);window.addEventListener('hashchange',sync);return()=>window.removeEventListener('hashchange',sync);},[]);return <main className="app-shell"><h1>Synthetic build workflow</h1><p>Memory-only fixtures. No scanner or personal inventory access.</p><div className="comparison-toolbar"><button onClick={()=>{document.documentElement.dataset.theme=document.documentElement.dataset.theme==='light'?'dark':'light';}}>QA theme</button><a href="#comparison">Comparison</a><a href="#optimizer">Optimizer</a><a href="#speed">Speed tuning</a><button onClick={()=>setInventory({...initial,importedAt:new Date().toISOString()})}>QA reimport</button></div><ComparisonWorkspace inventory={inventory} optimizerVisible={view==='#optimizer'} speedVisible={view==='#speed'}/></main>;}
const root=createRoot(document.getElementById('root')!);root.render(<Preview/>);
if(import.meta.hot)import.meta.hot.dispose(()=>root.unmount());
