import 'fake-indexeddb/auto';
import {afterEach,beforeEach,expect,test,vi} from 'vitest';
import {IDBFactory} from 'fake-indexeddb';
import {act,cleanup,render,screen,waitFor,within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../src/app/App';
import {inventorySlots,parseInventory} from '../src/domain/inventory';
import {emptyProfile} from '../src/domain/comparison';
import {defaultTeam} from '../src/domain/speed';
import {runSearch} from '../src/domain/optimizer';
import {loadInventory} from '../src/storage/inventory';
import {loadComparisons} from '../src/storage/comparison';
import {loadTeam} from '../src/storage/speed';
import type {SearchRequest,SearchResponse} from '../src/workers/optimizer.protocol';
import characterExport from './fixtures/character-export.json';

class AcceptanceWorker {
  static instances:AcceptanceWorker[]=[];
  onmessage:((event:MessageEvent<SearchResponse>)=>void)|null=null;onerror=null;request:SearchRequest|null=null;terminated=false;
  constructor(){AcceptanceWorker.instances.push(this);}
  postMessage(request:SearchRequest){this.request=request;}
  terminate(){this.terminated=true;}
  complete(){const {runId,revision,input}=this.request!;this.onmessage?.(new MessageEvent<SearchResponse>('message',{data:{runId,revision,kind:'complete',report:runSearch(input)}}));}
}
beforeEach(()=>{vi.stubGlobal('indexedDB',new IDBFactory());AcceptanceWorker.instances=[];});
afterEach(()=>{cleanup();vi.unstubAllGlobals();history.replaceState(null,'','/');localStorage.clear();});
const scanner={source:'HSR-Scanner',version:4,characters:[{id:'1308',name:'Acheron'}],relics:inventorySlots.map((slot,i)=>({_uid:`accept_${i}`,set_id:i<4?'102':'314',name:i<4?'Musketeer of Wild Wheat':'Izumo Gensei and Takama Divine Realm',slot,rarity:5,level:15,mainstat:['HP','ATK','CRIT DMG','SPD','Lightning DMG Boost','ATK'][i],substats:[{key:'Effect RES_',value:2}],location:'1308',lock:true,discard:false}))};
function file(value:unknown){const f=new File(['fixture'],'acceptance.json',{type:'application/json'});Object.defineProperty(f,'text',{value:async()=>JSON.stringify(value)});return f;}

test('import → comparison → optimizer → B → team → reload preserves all three independent stores',async()=>{
  vi.stubGlobal('Worker',AcceptanceWorker);const user=userEvent.setup();const view=render(<App/>);
  const picker=screen.getByLabelText('Import scanner JSON or Orbit backup');
  await waitFor(()=>expect((picker as HTMLInputElement).disabled).toBe(false));
  await user.upload(picker,file(scanner));await user.click(await screen.findByRole('button',{name:'Replace inventory'}));
  expect((await loadInventory())?.relics).toHaveLength(6);
  await user.click(screen.getByRole('link',{name:'Comparison'}));
  await waitFor(()=>expect(screen.getByRole('group',{name:'Build workspace controls'})).toHaveProperty('disabled',false));
  await user.selectOptions(screen.getByLabelText('Character'),'1308');await user.click(screen.getByRole('button',{name:'Load character'}));
  await user.click(screen.getByText('Review profile',{exact:true}));
  for(const [name,value] of [['Character base HP','1000'],['Character base ATK','500'],['Character base DEF','400'],['Character base SPD','100']]){await user.clear(screen.getByLabelText(name));await user.type(screen.getByLabelText(name),value);}
  await user.type(screen.getByLabelText('Snapshot name'),'Acceptance reference');await user.click(screen.getByRole('button',{name:'Save candidate'}));
  await waitFor(()=>expect(screen.getByRole('group',{name:'Build workspace controls'})).toHaveProperty('disabled',false));
  await user.click(screen.getByRole('link',{name:'Optimizer'}));await user.selectOptions(screen.getByLabelText('Goal'),'cv');await user.click(screen.getByRole('button',{name:'Find builds'}));
  await act(async()=>AcceptanceWorker.instances.at(-1)!.complete());
  await user.click(screen.getByRole('button',{name:'Compare build'}));
  for(const slot of inventorySlots){expect(within(screen.getByRole('region',{name:'Current build'})).getByText(slot,{exact:true})).toBeTruthy();expect(within(screen.getByRole('region',{name:'Candidate'})).getByText(slot,{exact:true})).toBeTruthy();}
  await user.click(screen.getByRole('button',{name:'Save candidate'}));
  await waitFor(async()=>expect((await loadComparisons())[0].b.Body?.id).toBe('accept_2'));
  await user.click(screen.getByRole('link',{name:'Speed tuning'}));await user.click(screen.getByRole('button',{name:'Load example team'}));await user.click(screen.getByRole('button',{name:'Use candidate SPD'}));await user.selectOptions(screen.getByLabelText('Replace member'),'0');await user.click(screen.getByRole('button',{name:'Confirm replacement'}));await user.click(screen.getByRole('button',{name:'Save team'}));
  const saved=await loadTeam();expect(saved?.members[0].panelSPD).toBeCloseTo(131.032);expect(saved?.members[0].precision).toBe('ocr');
  await user.click(screen.getByRole('link',{name:'Inventory'}));await user.upload(picker,file({...scanner,version:99}));
  expect(await screen.findByRole('alert')).toHaveProperty('textContent','version: only scanner schema 4 is supported');
  expect((await loadInventory())?.relics).toHaveLength(6);
  await user.upload(picker,file({...scanner,relics:[]}));await user.click(screen.getByRole('button',{name:'Replace inventory'}));
  expect((await loadInventory())?.relics).toHaveLength(0);expect((await loadComparisons())[0].a.Head?.id).toBe('accept_0');expect(await loadTeam()).toEqual(saved);
  view.unmount();history.replaceState(null,'','/#speed');render(<App/>);
  await screen.findByText('Saved team restored from this browser.');expect(screen.getByLabelText('Member 1 panel SPD')).toHaveProperty('valueAsNumber',saved!.members[0].panelSPD);
  await user.click(screen.getByRole('link',{name:'Comparison'}));await user.click(screen.getByText('Saved builds and backups',{exact:true}));await user.click(screen.getByRole('button',{name:'Load Acceptance reference'}));
  for(const slot of inventorySlots)expect(within(screen.getByRole('region',{name:'Saved build'})).getByText(slot,{exact:true})).toBeTruthy();
},20000);

test('aborted writes preserve inventory, comparison and team together',async()=>{
  const {saveInventory}=await import('../src/storage/inventory');const {saveComparisons}=await import('../src/storage/comparison');const {saveTeam}=await import('../src/storage/speed');
  await saveInventory(parseInventory(JSON.stringify(scanner)));
  await saveComparisons([{name:'Before abort',profile:{...emptyProfile,name:'Manual',base:{HP:1000,ATK:500,DEF:400,SPD:100}},a:{},b:{},precision:'ocr'}]);
  await saveTeam(defaultTeam());
  const inventory=await loadInventory();const pairs=await loadComparisons();const team=await loadTeam();expect(inventory).not.toBeNull();expect(team).not.toBeNull();
  const put=vi.spyOn(IDBObjectStore.prototype,'put').mockImplementation(function(this:IDBObjectStore){this.transaction.abort();throw new DOMException('Storage full','QuotaExceededError');});
  try{await expect(saveInventory(inventory!)).rejects.toThrow();await expect(saveComparisons(pairs)).rejects.toThrow();await expect(saveTeam(team!)).rejects.toThrow();}finally{put.mockRestore();}
  expect(await loadInventory()).toEqual(inventory);expect(await loadComparisons()).toEqual(pairs);expect(await loadTeam()).toEqual(team);
});

function targetInventory(){
  const character=structuredClone(characterExport.characters[0]);
  for(const key of Object.keys(character.traces!))if(key!=='secret')Reflect.set(character.traces!,key,false);
  const fixed=inventorySlots.map((slot,i)=>({_uid:`target_${i}`,set_id:i<4?'101':'301',name:'Synthetic',slot,rarity:5,level:0,mainstat:i===1?'ATK':'HP',substats:[],location:'1308',lock:false,discard:false}));
  const alternatives=([['below',32.9,180,''],['best',33,160,''],['borrowed',44,140,'1101']] as const).map(([id,spd,crit,owner])=>({...fixed[1],_uid:id,location:owner,substats:[{key:'SPD',value:spd},{key:'CRIT DMG_',value:crit}],preview_substats:[{key:'SPD',value:100}],reroll_substats:[{key:'CRIT DMG_',value:300}]}));
  return {...characterExport,characters:[character],relics:[...fixed,...alternatives]};
}
async function importFixture(user:ReturnType<typeof userEvent.setup>,value:unknown){
  const picker=screen.getByLabelText('Import scanner JSON or Orbit backup');
  await waitFor(()=>expect(picker).toHaveProperty('disabled',false));
  await user.upload(picker,file(value));await user.click(await screen.findByRole('button',{name:'Replace inventory'}));
}
async function baselineTargets(user:ReturnType<typeof userEvent.setup>){
  await user.click(screen.getByRole('link',{name:'Comparison'}));
  await waitFor(()=>expect(screen.getByRole('group',{name:'Build workspace controls'})).toHaveProperty('disabled',false));
  await user.selectOptions(screen.getByLabelText('Character'),'1308');
  await user.click(screen.getByLabelText('Use pinned baseline kit'));await user.selectOptions(screen.getByLabelText('Profile Light Cone'),'none');
  await user.click(screen.getByRole('button',{name:'Load character'}));
  await user.click(screen.getByRole('button',{name:'Find upgrades'}));
  await screen.findByRole('heading',{name:'Optimize this character'});
  await user.selectOptions(screen.getByLabelText('Goal'),'targets');await user.selectOptions(screen.getByLabelText('Then maximize'),'CRIT DMG_');await user.type(screen.getByLabelText('Minimum SPD'),'134');
}

test('owned baseline → hard targets → legal candidate → saved build → confirmed speed snapshot survives reload',async()=>{
  vi.stubGlobal('Worker',AcceptanceWorker);const user=userEvent.setup();const view=render(<App/>);
  await importFixture(user,targetInventory());await baselineTargets(user);
  await user.click(screen.getByRole('button',{name:'Find builds'}));
  const request=AcceptanceWorker.instances.at(-1)!.request!;
  expect(request.input.profile.base.SPD).toBe(101);
  expect(request.input.relics.some(r=>r.id==='borrowed')).toBe(false);
  await act(async()=>AcceptanceWorker.instances.at(-1)!.complete());
  expect(screen.getByRole('heading',{name:'Build 1 · CRIT DMG % 210.000'})).toBeTruthy();
  await user.click(screen.getByRole('button',{name:'Compare build'}));
  expect(screen.getByRole('row',{name:'SPD 101.000 134.000 +33.000'})).toBeTruthy();
  expect(screen.getByRole('row',{name:'CRIT DMG % 50.000 210.000 +160.000'})).toBeTruthy();
  expect(within(screen.getByLabelText('Candidate target status')).getByText('Candidate: Targets met')).toBeTruthy();
  await user.type(screen.getByLabelText('Snapshot name'),'Target baseline');await user.click(screen.getByRole('button',{name:'Save candidate'}));
  await waitFor(async()=>expect((await loadComparisons())[0].b.Hands?.id).toBe('best'));
  const pair=(await loadComparisons())[0];expect(pair.a.Hands?.id).toBe('target_1');expect(pair.profile.origin?.characterId).toBe('1308');
  await user.click(screen.getByRole('link',{name:'Speed tuning'}));await user.click(screen.getByRole('button',{name:'Load example team'}));await user.click(screen.getByRole('button',{name:'Use candidate SPD'}));
  expect(await loadTeam()).toBeNull();expect(screen.getByRole('button',{name:'Confirm replacement'})).toHaveProperty('disabled',true);
  await user.selectOptions(screen.getByLabelText('Replace member'),'0');await user.click(screen.getByRole('button',{name:'Confirm replacement'}));
  expect(await loadTeam()).toBeNull();
  expect(within(screen.getByRole('region',{name:'Actions per cycle'})).getByRole('row',{name:'C0 2 1 1 1'})).toBeTruthy();
  await user.click(screen.getByRole('button',{name:'Save team'}));
  await waitFor(async()=>expect((await loadTeam())?.members[0].panelSPD).toBe(134));
  expect((await loadTeam())!.members[0]).toMatchObject({baseSPD:101,panelSPD:134,precision:'packet',buffPercent:0,flatBuff:0,advance:0});
  await user.click(screen.getByRole('link',{name:'Comparison'}));await user.click(screen.getByRole('button',{name:'Clear candidate Hands'}));
  await user.click(screen.getByRole('link',{name:'Speed tuning'}));
  expect(screen.getByRole('button',{name:'Use candidate SPD'})).toHaveProperty('disabled',true);
  expect(screen.getByLabelText('Member 1 panel SPD')).toHaveProperty('valueAsNumber',134);
  view.unmount();history.replaceState(null,'','/#speed');render(<App/>);
  await screen.findByText('Saved team restored from this browser.');expect(screen.getByLabelText('Member 1 panel SPD')).toHaveProperty('valueAsNumber',134);
  await user.click(screen.getByRole('link',{name:'Comparison'}));await user.click(screen.getByText('Saved builds and backups',{exact:true}));await user.click(await screen.findByRole('button',{name:'Load Target baseline'}));
  expect(screen.getByRole('region',{name:'Saved build'})).toBeTruthy();expect((await loadComparisons())[0]).toEqual(pair);
  expect((await loadInventory())!.relics).toHaveLength(9);
},20000);

test('profile edits and reimport reject old search callbacks without relaxing targets or saving results',async()=>{
  vi.stubGlobal('Worker',AcceptanceWorker);const user=userEvent.setup();render(<App/>);
  const raw=targetInventory();await importFixture(user,raw);await baselineTargets(user);
  await user.click(screen.getByRole('button',{name:'Find builds'}));const old=AcceptanceWorker.instances.at(-1)!;
  await user.click(screen.getByText('Review profile',{exact:true}));await user.clear(screen.getByLabelText('Character base SPD'));await user.type(screen.getByLabelText('Character base SPD'),'99');
  expect(old.terminated).toBe(true);await act(async()=>old.complete());expect(screen.queryByRole('button',{name:'Compare build'})).toBeNull();
  await user.click(screen.getByRole('button',{name:'Find builds'}));const beforeImport=AcceptanceWorker.instances.at(-1)!;
  await user.click(screen.getByRole('link',{name:'Inventory'}));await importFixture(user,{...raw,relics:raw.relics.filter(r=>r._uid!=='best')});
  expect(beforeImport.terminated).toBe(true);
  await user.click(screen.getByRole('link',{name:'Optimizer'}));await act(async()=>beforeImport.complete());
  expect(screen.queryByRole('button',{name:'Compare build'})).toBeNull();expect(screen.getByLabelText('Minimum SPD')).toHaveProperty('value','134');
  expect(screen.getByLabelText('Character base SPD')).toHaveProperty('value','99');
  await user.click(screen.getByRole('button',{name:'Find builds'}));await act(async()=>AcceptanceWorker.instances.at(-1)!.complete());
  expect(screen.getByRole('heading',{name:'No build meets these targets in this relic pool'})).toBeTruthy();
  expect(await loadComparisons()).toEqual([]);expect(await loadTeam()).toBeNull();
  expect((await loadInventory())!.relics.some(r=>r.id==='best')).toBe(false);
},20000);

test('legacy imports stay readable without fabricated progression and invalid replacements preserve storage',async()=>{
  const user=userEvent.setup();render(<App/>);
  await importFixture(user,{format:'orbit-inventory',schemaVersion:1,scanner});
  const legacy=await loadInventory();expect(legacy!.roster.source).toBe('legacy-backup');expect(legacy!.characters[0].progression).toBeUndefined();
  const picker=screen.getByLabelText('Import scanner JSON or Orbit backup');
  await waitFor(()=>expect(picker).toHaveProperty('disabled',false));
  await user.upload(picker,file({...targetInventory(),characters:[{id:'1308',name:'Invalid synthetic',level:'bad'}]}));
  expect((await screen.findByRole('alert')).textContent).toContain('level');expect(await loadInventory()).toEqual(legacy);
  await user.click(screen.getByRole('link',{name:'Comparison'}));await user.selectOptions(screen.getByLabelText('Character'),'1308');await user.click(screen.getByLabelText('Use pinned baseline kit'));await user.selectOptions(screen.getByLabelText('Profile Light Cone'),'none');await user.click(screen.getByRole('button',{name:'Load character'}));
  expect(within(screen.getByRole('region',{name:'Current build assessment'})).getByText('Profile incomplete',{exact:true})).toBeTruthy();
  await user.click(screen.getByRole('button',{name:'Use manual profile'}));expect(screen.getByRole('button',{name:'Find upgrades'})).toHaveProperty('disabled',true);
  await user.click(screen.getByText('Review profile',{exact:true}));expect(screen.getByLabelText('Character base SPD')).toHaveProperty('value','0');
  expect(await loadComparisons()).toEqual([]);expect(await loadTeam()).toBeNull();
},20000);
