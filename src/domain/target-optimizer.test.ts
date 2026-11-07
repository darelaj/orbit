import {expect,test} from 'vitest';
import {calculateBuild,type BuildProfile,type Loadout} from './comparison';
import {inventorySlots,parseInventory} from './inventory';
import {defaultOptions,objectiveScore,runSearch,type Objective} from './optimizer';

const profile:BuildProfile={name:'Synthetic target fixture',base:{HP:1000,ATK:500,DEF:400,SPD:100},cone:{HP:0,ATK:0,DEF:0},corrections:{'CRIT Rate_':5,'CRIT DMG_':50}};
const fixed=inventorySlots.map((slot,i)=>({_uid:`fixed_${i}`,set_id:i<4?'101':'301',name:'Synthetic',slot,rarity:5,level:0,mainstat:i===1?'ATK':'HP',substats:[],location:'',lock:false,discard:false}));
const relics=parseInventory(JSON.stringify({source:'reliquary_archiver',version:4,relics:[...fixed.filter(r=>r.slot!=='Hands'),...[['A',33.9,180],['B',34,160],['C',45,140]].map(([id,speed,crit])=>({...fixed[1],_uid:String(id),substats:[{key:'SPD',value:speed},{key:'CRIT DMG_',value:crit}]}))]})).relics;

test('reach SPD then maximize CRIT DMG saturates SPD and never relaxes simultaneous minimums',()=>{
  const options={...defaultOptions,goal:'targets' as const,objective:'CRIT DMG_' as const,minimums:{SPD:134}};
  const report=runSearch({profile,relics,options});
  expect(report.results.map(r=>[r.loadout.Hands!.id,r.totals.SPD,r.score])).toEqual([['B',134,210],['C',145,190]]);
  expect(report.rejected).toBe(1);expect(report.invalid).toBe(0);expect(report.missedBounds).toEqual([{stat:'SPD',minimum:134,maximum:undefined,builds:1}]);
  const impossible=runSearch({profile,relics,options:{...options,minimums:{SPD:134,'CRIT DMG_':220}}});
  expect(impossible.results).toEqual([]);expect(impossible.exhaustive).toBe(true);expect(impossible.rejected).toBe(3);
  expect(impossible.missedBounds.map(b=>[b.stat,b.builds])).toEqual([['SPD',1],['CRIT DMG_',2]]);
  const tieRelics=relics.map(r=>r.id==='C'?{...r,substats:[{key:'SPD',value:45},{key:'CRIT DMG_',value:160}]}:r);
  expect(runSearch({profile,relics:tieRelics,options}).results.map(r=>r.loadout.Hands!.id)).toEqual(['B','C']);
});

test('CV includes computed contributions once and does not cap excess CRIT Rate',()=>{
  const noCrit=relics.filter(r=>r.id!=='A'&&r.id!=='C').map(r=>r.id==='B'?{...r,substats:[]}:r);
  for(const [rate,damage,expected]of [[70,140,280],[110,140,360]]){
    const p={...profile,corrections:{'CRIT Rate_':rate,'CRIT DMG_':damage}};
    const result=runSearch({profile:p,relics:noCrit,options:{...defaultOptions,objective:'cv'}}).results[0];
    expect(result.score).toBe(expected);expect(result.warnings.some(w=>w.includes('exceeds 100%'))).toBe(rate>100);
    expect(objectiveScore(result.totals,'crit-index')).toBeCloseTo(result.totals.ATK*(rate===70?1.98:2.4));
  }
  const preview=noCrit.map(r=>r.id==='B'?{...r,preview:[{key:'CRIT Rate_',value:99}],reroll:[{key:'CRIT DMG_',value:99}]}:r);
  expect(runSearch({profile,relics:preview,options:{...defaultOptions,objective:'cv'}}).results[0].score).toBe(60);
  const withMainAndSet=noCrit.map(r=>r.slot==='Body'?{...r,mainStat:'CRIT DMG',level:15}:r.slot==='Planar Sphere'||r.slot==='Link Rope'?{...r,setId:'306'}:r);
  expect(runSearch({profile,relics:withMainAndSet,options:{...defaultOptions,objective:'cv'}}).results[0].score).toBeCloseTo(140.8);
});

test('all objectives match independent Cartesian reference under stat/set bounds',()=>{
  const expanded=relics.flatMap(r=>[r,{...r,id:`${r.id}_alt`,level:1}]);
  for(const objective of ['cv','CRIT Rate_','CRIT DMG_','SPD','ATK'] as Objective[]){
    const expected:{score:number;ids:string[]}[]=[];
    function visit(i:number,loadout:Loadout){
      if(i===6){const totals=calculateBuild(profile,loadout).totals;if(totals.SPD<134||totals.SPD>145||totals['CRIT DMG_']<190)return;const score=objective==='cv'?2*totals['CRIT Rate_']+totals['CRIT DMG_']:totals[objective as 'ATK'|'SPD'|'CRIT Rate_'|'CRIT DMG_'];expected.push({score,ids:inventorySlots.map(s=>loadout[s]!.id)});return;}
      const slot=inventorySlots[i];for(const item of expanded.filter(r=>r.slot===slot))visit(i+1,{...loadout,[slot]:item});
    }
    visit(0,{});expected.sort((a,b)=>{if(a.score!==b.score)return b.score-a.score;for(let i=0;i<6;i++){if(a.ids[i]!==b.ids[i])return a.ids[i]<b.ids[i]?-1:1;}return 0;});
    const result=runSearch({profile,relics:expanded,options:{...defaultOptions,objective,minimums:{SPD:134,'CRIT DMG_':190},maximums:{SPD:145},requiredSets:[{id:'101',pieces:4},{id:'301',pieces:2}]}});
    expect(result.results.map(r=>({score:r.score,ids:inventorySlots.map(s=>r.loadout[s]!.id)}))).toEqual(expected.slice(0,10));
    expect(result.evaluated).toBe(result.feasible+result.rejected+result.invalid);
  }
});

test('invalid bounds and impossible set partitions fail before evaluation',()=>{
  for(const options of [
    {...defaultOptions,goal:'targets' as const},
    {...defaultOptions,minimums:{SPD:134},minSPD:134},
    {...defaultOptions,minimums:{'CRIT DMG_':220},maximums:{'CRIT DMG_':190}},
    {...defaultOptions,minimums:{SPD:NaN}}, {...defaultOptions,maximums:{SPD:Infinity}}, {...defaultOptions,minimums:{ATK:-1}},
    {...defaultOptions,requiredSets:[{id:'101',pieces:4},{id:'102',pieces:2}]},
    {...defaultOptions,requiredSets:[{id:'301',pieces:4}]},
    {...defaultOptions,requiredSets:[{id:'301',pieces:2},{id:'314',pieces:2}]},
    {...defaultOptions,requiredSets:[{id:'unknown',pieces:2}]},
  ])expect(()=>runSearch({profile,relics,options})).toThrow();
  const limited=runSearch({profile,relics,options:{...defaultOptions,mode:'limited',budget:1,objective:'CRIT DMG_',minimums:{SPD:134}}});
  expect(limited.results).toEqual([]);expect(limited.exhaustive).toBe(false);
  expect(runSearch({profile,relics,options:{...defaultOptions,minimums:{SPD:undefined}}}).feasible).toBe(3);
  expect(()=>runSearch({profile,relics,options:{...defaultOptions,goal:'targets',minimums:{SPD:undefined}}})).toThrow('minimum target');
  const invalid=runSearch({profile,relics:relics.map(r=>r.slot==='Head'?{...r,mainStat:'Unknown'}:r),options:defaultOptions});
  expect(invalid.invalid).toBe(3);expect(invalid.feasible).toBe(0);expect(invalid.exhaustive).toBe(true);
});
