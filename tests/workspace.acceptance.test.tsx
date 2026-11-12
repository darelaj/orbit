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
  await user.click(screen.getByRole('link',{name:'Speed tuning'}));await user.click(screen.getByRole('button',{name:'Use comparison B SPD'}));await user.click(screen.getByRole('button',{name:'Save team'}));
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
