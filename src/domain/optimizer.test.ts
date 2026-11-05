import {expect,test} from 'vitest';
import {calculateBuild,type BuildProfile,type Loadout} from './comparison';
import {inventorySlots,parseInventory} from './inventory';
import {defaultOptions,runSearch,type SearchInput} from './optimizer';
const profile:BuildProfile={name:'Test',base:{HP:1000,ATK:500,DEF:400,SPD:100},cone:{HP:500,ATK:100,DEF:100},corrections:{'CRIT Rate_':5,'CRIT DMG_':50}};
const relics=parseInventory(JSON.stringify({source:'HSR-Scanner',version:4,relics:inventorySlots.flatMap((slot,i)=>[0,1].map(n=>({_uid:`${i}_${n}`,set_id:i<4?'102':'314',name:'Synthetic',slot,rarity:5,level:n?15:0,mainstat:['HP','ATK','CRIT DMG','SPD','HP','ATK'][i],substats:[{key:'Effect RES_',value:n?2:0}],location:'',lock:n===1,discard:false})))})).relics;
export const searchFixture:SearchInput={profile,relics,options:{...defaultOptions}};
test('exact results equal independent brute force over all six-slot combinations',()=>{
  const scores:number[]=[];
  for(let mask=0;mask<64;mask++){const loadout:Loadout={};inventorySlots.forEach((slot,i)=>{loadout[slot]=relics[i*2+((mask>>i)&1)];});scores.push(calculateBuild(profile,loadout).totals.ATK);}
  const result=runSearch(searchFixture);
  expect(result.total).toBe('64');expect(result.evaluated).toBe(64);expect(result.exhaustive).toBe(true);
  expect(result.results.map(r=>r.score)).toEqual(scores.sort((a,b)=>b-a).slice(0,10));
  expect(result.results.every(r=>Object.keys(r.loadout).length===6)).toBe(true);
});
test('SPD/set/exclusion constraints are applied before ranking',()=>{
  const result=runSearch({...searchFixture,options:{...defaultOptions,minSPD:120,maxSPD:140,requiredSets:[{id:'102',pieces:4}],excludeIds:['0_1']}});
  expect(result.results.length).toBeGreaterThan(0);
  for(const r of result.results){expect(r.totals.SPD).toBeGreaterThanOrEqual(120);expect(r.totals.SPD).toBeLessThanOrEqual(140);expect(r.loadout.Head!.id).toBe('0_0');expect(Object.values(r.loadout).filter(r=>r.setId==='102')).toHaveLength(4);}
  expect(runSearch({...searchFixture,options:{...defaultOptions,minSPD:1000}}).results).toEqual([]);
});
test('limits disclose non-exhaustive sampling and invalid configurations fail',()=>{
  expect(()=>runSearch({...searchFixture,options:{...defaultOptions,budget:2}})).toThrow('64');
  const limited=runSearch({...searchFixture,options:{...defaultOptions,mode:'limited',budget:3}});
  expect(limited.exhaustive).toBe(false);expect(limited.evaluated).toBe(3);expect(limited.results.length).toBeLessThanOrEqual(3);
  expect(runSearch({...searchFixture,options:{...defaultOptions,includeLocked:false}}).total).toBe('1');
  expect(()=>runSearch({...searchFixture,relics:[]})).toThrow('No eligible');
  expect(()=>runSearch({...searchFixture,options:{...defaultOptions,minSPD:150,maxSPD:120}})).toThrow('Minimum');
});
test('large combination counts use integer arithmetic without allocating the search space',()=>{
  const large=Array.from({length:9996},(_,i)=>({...relics[(i%6)*2],id:`large_${i}`}));
  const result=runSearch({...searchFixture,relics:large,options:{...defaultOptions,mode:'limited',budget:1}});
  expect(BigInt(result.total)).toBeGreaterThan(BigInt(Number.MAX_SAFE_INTEGER));
  expect(result.evaluated).toBe(1);expect(result.results).toHaveLength(1);expect(result.exhaustive).toBe(false);
});
test('uncomputable builds are disclosed and index objective is explicitly separate from ATK',()=>{
  const result=runSearch({...searchFixture,relics:relics.map(r=>r.slot==='Head'?{...r,mainStat:'Unsupported'}:r)});
  expect(result.invalid).toBe(64);expect(result.invalidReasons.length).toBeGreaterThan(0);expect(result.results).toEqual([]);
  const indexed=runSearch({...searchFixture,options:{...defaultOptions,objective:'crit-index'}});
  const best=indexed.results[0];expect(best.score).toBeCloseTo(best.totals.ATK*(1+best.totals['CRIT Rate_']/100*best.totals['CRIT DMG_']/100));
});
