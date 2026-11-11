import {afterEach,expect,test,vi} from 'vitest';
import {act,cleanup,render,screen,within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {useState} from 'react';
import OptimizerWorkspace from './OptimizerWorkspace';
import {newBuildGoal,type BuildGoal} from './GoalControls';
import type {SearchRequest,SearchResponse} from '../../workers/optimizer.protocol';
import {runSearch} from '../../domain/optimizer';
import {type BuildProfile,type Loadout} from '../../domain/comparison';
import {inventorySlots,parseInventory,type Inventory} from '../../domain/inventory';
class FakeWorker{
  static instances:FakeWorker[]=[];onmessage:((e:MessageEvent<SearchResponse>)=>void)|null=null;onerror=null;request:SearchRequest|null=null;terminated=false;
  constructor(){FakeWorker.instances.push(this);}
  postMessage(request:SearchRequest){this.request=request;}
  terminate(){this.terminated=true;}
  complete(){const {runId,revision,input}=this.request!;this.onmessage?.(new MessageEvent<SearchResponse>('message',{data:{runId,revision,kind:'complete',report:runSearch(input)}}));}
}
const profile:BuildProfile={name:'Synthetic',characterId:'1308',base:{HP:1000,ATK:500,DEF:400,SPD:100},cone:{HP:0,ATK:0,DEF:0},corrections:{'CRIT Rate_':5,'CRIT DMG_':50}};
const current:Loadout={};
const fixed=inventorySlots.map((slot,i)=>({_uid:`fixed_${i}`,set_id:i<4?'101':'301',name:'Synthetic',slot,rarity:5,level:0,mainstat:i===1?'ATK':'HP',substats:[],location:'',lock:false,discard:false}));
const inventory=parseInventory(JSON.stringify({source:'reliquary_archiver',version:4,relics:[...fixed.filter(r=>r.slot!=='Hands'),...[[33.9,180,''],[34,160,'1308'],[45,140,'1101']].map(([spd,cd,owner],i)=>({...fixed[1],_uid:`hand_${i}`,substats:[{key:'SPD',value:spd},{key:'CRIT DMG_',value:cd}],location:owner}))]}));
function Harness({inv=inventory,onApply=vi.fn(),initial=newBuildGoal()}:{inv?:Inventory;onApply?:(loadout:Loadout)=>void;initial?:BuildGoal}){const [goal,setGoal]=useState(initial);return <OptimizerWorkspace active inventory={inv} profile={profile} current={current} goal={goal} onGoalChange={setGoal} onApply={onApply}/>;}
afterEach(()=>{cleanup();vi.unstubAllGlobals();FakeWorker.instances=[];});
function setup(){vi.stubGlobal('Worker',FakeWorker);return userEvent.setup();}

test('explicit goals, hard SPD/CDM targets and borrowing use the actual worker request',async()=>{
  const user=setup();const applied=vi.fn();render(<Harness onApply={applied}/>);
  expect(screen.getByRole('button',{name:'Find builds'})).toHaveProperty('disabled',true);
  await user.selectOptions(screen.getByLabelText('Goal'),'targets');
  await user.selectOptions(screen.getByLabelText('Then maximize'),'CRIT DMG_');
  expect(screen.getByRole('button',{name:'Find builds'})).toHaveProperty('disabled',true);
  await user.type(screen.getByLabelText('Minimum SPD'),'134');
  await user.click(screen.getByRole('button',{name:'Find builds'}));
  expect(FakeWorker.instances[0].request!.input.relics.some(r=>r.location==='1101')).toBe(false);
  await act(async()=>FakeWorker.instances[0].complete());
  expect(screen.getByRole('heading',{name:'Best in this relic pool'})).toBeTruthy();
  expect(screen.getByRole('heading',{name:'Build 1 · CRIT DMG % 210.000'})).toBeTruthy();
  await user.click(screen.getByRole('button',{name:'Compare build'}));
  expect(applied.mock.calls[0][0].Hands.id).toBe('hand_1');
  await user.click(screen.getByLabelText('Hands relic details'));
  expect(screen.getByText('Active substats: SPD 34, CRIT DMG % 160.')).toBeTruthy();
  await user.selectOptions(screen.getByLabelText('Add minimum'),'CRIT DMG_');
  await user.type(screen.getByLabelText('Minimum CRIT DMG %'),'220');
  await user.click(screen.getByRole('button',{name:'Find builds'}));
  await act(async()=>FakeWorker.instances[1].complete());
  expect(screen.getByRole('heading',{name:'No build meets these targets in this relic pool'})).toBeTruthy();
  await user.click(screen.getByLabelText('Borrow from other characters'));
  await user.selectOptions(screen.getByLabelText('Goal'),'cv');
  await user.click(screen.getByRole('button',{name:'Find builds'}));
  expect(FakeWorker.instances[2].request!.input.relics.some(r=>r.location==='1101')).toBe(true);
  expect(FakeWorker.instances[2].request!.input.options.minimums).toBeUndefined();
});

test('cancel, edited targets and reimport remove stale results while filters remain',async()=>{
  const user=setup();const view=render(<Harness/>);
  await user.selectOptions(screen.getByLabelText('Goal'),'targets');
  await user.type(screen.getByLabelText('Minimum SPD'),'100');
  await user.click(screen.getByRole('button',{name:'Find builds'}));
  await user.click(screen.getByRole('button',{name:'Cancel search'}));
  expect(FakeWorker.instances[0].terminated).toBe(true);
  await act(async()=>FakeWorker.instances[0].complete());
  expect(screen.queryByRole('button',{name:'Compare build'})).toBeNull();
  await user.click(screen.getByRole('button',{name:'Find builds'}));
  await user.type(screen.getByLabelText('Minimum SPD'),'1');
  expect(FakeWorker.instances[1].terminated).toBe(true);
  await act(async()=>FakeWorker.instances[1].complete());
  expect(screen.queryByRole('button',{name:'Compare build'})).toBeNull();
  await user.clear(screen.getByLabelText('Minimum SPD'));await user.type(screen.getByLabelText('Minimum SPD'),'100');
  await user.click(screen.getByText('Advanced search settings'));
  await user.selectOptions(screen.getByLabelText('Head main stat'),'HP');
  await user.click(screen.getByRole('button',{name:'Find builds'}));
  view.rerender(<Harness inv={{...inventory,relics:[]}}/>);
  expect(FakeWorker.instances[2].terminated).toBe(true);
  expect(screen.getByLabelText('Head main stat')).toHaveProperty('value','HP');
  expect(screen.getByRole('option',{name:'HP (unavailable in current inventory)'})).toBeTruthy();
  expect(screen.getByRole('button',{name:'Find builds'})).toHaveProperty('disabled',true);
});

test('quick search is explicit, never claims an optimum and remains inconclusive without matches',async()=>{
  const user=setup();
  const pool={...inventory,relics:inventorySlots.flatMap(slot=>Array.from({length:4},(_,i)=>({...inventory.relics.find(r=>r.slot===slot)!,id:`${slot}_${i}`,location:''})))};
  const initial=newBuildGoal();initial.options.budget=1000;
  render(<Harness inv={pool} initial={initial}/>);
  await user.selectOptions(screen.getByLabelText('Goal'),'targets');await user.type(screen.getByLabelText('Minimum SPD'),'999');
  expect(screen.getByRole('button',{name:'Find builds'})).toHaveProperty('disabled',true);
  await user.click(screen.getByRole('button',{name:'Use quick search'}));
  await user.click(screen.getByRole('button',{name:'Find builds'}));
  await act(async()=>FakeWorker.instances[0].complete());
  expect(screen.getByRole('heading',{name:'No matching build found in this search'})).toBeTruthy();
  expect(screen.queryByRole('heading',{name:'Best in this relic pool'})).toBeNull();
});

test('set legality and maximum constraints block invalid searches without widening scope',async()=>{
  const user=setup();render(<Harness/>);
  await user.selectOptions(screen.getByLabelText('Goal'),'stat');
  await user.selectOptions(screen.getByLabelText('Cavern set'),'101');
  await user.selectOptions(screen.getByLabelText('Second Cavern set (optional)'),'101');
  expect(screen.getByRole('button',{name:'Find builds'})).toHaveProperty('disabled',true);
  expect(screen.getByText(/unique IDs/)).toBeTruthy();
  await user.selectOptions(screen.getByLabelText('Second Cavern set (optional)'),'');
  await user.selectOptions(screen.getByLabelText('Planar set'),'301');
  await user.click(screen.getByText('Advanced search settings'));
  await user.type(screen.getByLabelText('Maximum SPD'),'99');
  await user.click(screen.getByRole('button',{name:'Find builds'}));
  await act(async()=>FakeWorker.instances[0].complete());
  expect(screen.getByRole('heading',{name:'No build meets these targets in this relic pool'})).toBeTruthy();
  expect(within(screen.getByLabelText('Planar set')).getAllByRole('option')).toHaveLength(2);
});
