import {afterEach,expect,test,vi} from 'vitest';
import {cleanup,render,screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import OptimizerWorkspace from './OptimizerWorkspace';
import type {SearchRequest,SearchResponse} from '../../workers/optimizer.protocol';
import {runSearch} from '../../domain/optimizer';
import {emptyProfile} from '../../domain/comparison';
import {inventorySlots,parseInventory} from '../../domain/inventory';
class FakeWorker{
  static instances:FakeWorker[]=[];onmessage:((e:MessageEvent<SearchResponse>)=>void)|null=null;onerror=null;request:SearchRequest|null=null;terminated=false;
  constructor(){FakeWorker.instances.push(this);}
  postMessage(request:SearchRequest){this.request=request;}
  terminate(){this.terminated=true;}
  complete(){const {runId,revision,input}=this.request!;this.onmessage?.(new MessageEvent<SearchResponse>('message',{data:{runId,revision,kind:'complete',report:runSearch(input)}}));}
}
afterEach(()=>{cleanup();vi.unstubAllGlobals();FakeWorker.instances=[];});
test('worker results apply only while current; input changes cancel and stale completion is hidden',async()=>{
  vi.stubGlobal('Worker',FakeWorker);const user=userEvent.setup();const applied=vi.fn();
  const inventory=parseInventory(JSON.stringify({source:'HSR-Scanner',version:4,relics:inventorySlots.map((slot,i)=>({_uid:String(i),set_id:i<4?'102':'314',name:'Synthetic',slot,rarity:5,level:0,mainstat:['HP','ATK','CRIT DMG','SPD','HP','ATK'][i],substats:[],location:'',lock:false,discard:false}))}));
  const profile={...emptyProfile,name:'Manual',base:{HP:1000,ATK:500,DEF:400,SPD:100}};
  const {rerender}=render(<OptimizerWorkspace active inventory={inventory} profile={profile} onApply={applied}/>);
  await user.click(screen.getByRole('button',{name:'Run optimizer'}));
  await user.click(screen.getByRole('button',{name:'Cancel search'}));
  expect(FakeWorker.instances[0].terminated).toBe(true);
  FakeWorker.instances[0].complete();expect(screen.queryByRole('region',{name:'Optimizer results'})).toBeNull();
  await user.click(screen.getByRole('button',{name:'Run optimizer'}));
  const {act}=await import('@testing-library/react');await act(async()=>FakeWorker.instances[1].complete());
  await user.click(screen.getByRole('button',{name:'Compare result 1 in B'}));
  expect(Object.keys(applied.mock.calls[0][0])).toHaveLength(6);
  await user.click(screen.getByRole('button',{name:'Run optimizer'}));
  await user.type(screen.getByLabelText('Minimum SPD'),'120');
  expect(FakeWorker.instances[2].terminated).toBe(true);
  FakeWorker.instances[2].complete();expect(screen.queryByRole('region',{name:'Optimizer results'})).toBeNull();
  await user.click(screen.getByRole('button',{name:'Reset optimizer filters'}));
  await user.click(screen.getByText('Candidate eligibility and required sets'));
  await user.selectOptions(screen.getByLabelText('Head main stat'),'HP');
  await user.click(screen.getByRole('button',{name:'Run optimizer'}));
  rerender(<OptimizerWorkspace active inventory={{...inventory,relics:[]}} profile={profile} onApply={applied}/>);
  expect(FakeWorker.instances[3].terminated).toBe(true);
  expect(screen.getByLabelText('Head main stat')).toHaveProperty('value','HP');
  expect(screen.getByRole('option',{name:'HP (unavailable in current inventory)'})).toBeTruthy();

});
