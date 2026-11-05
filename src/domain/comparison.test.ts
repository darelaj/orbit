import { expect,test } from 'vitest';
import { calculateBuild, equippedLoadout, type BuildProfile, type Loadout } from './comparison';
import { parseInventory } from './inventory';
const profile:BuildProfile={name:'Manual test',base:{HP:1000,ATK:500,DEF:400,SPD:100},cone:{HP:500,ATK:100,DEF:100},corrections:{ATK_:20,ATK:50,SPD_:10,SPD:2,'CRIT Rate_':5}};
const relic=parseInventory(JSON.stringify({source:'HSR-Scanner',version:4,relics:[{_uid:'1',set_id:'102',name:'Musketeer',slot:'Hands',rarity:5,level:0,mainstat:'ATK',substats:[{key:'SPD',value:2.6}],preview_substats:[{key:'SPD',value:8}],reroll_substats:[{key:'SPD',value:20}],location:'1308',lock:false,discard:false}]})).relics[0];
test('base/percentage/flat order and SPD use character base; alternatives stay inactive',()=>{
  const result=calculateBuild(profile,{Hands:relic});
  expect(result.totals.ATK).toBeCloseTo(826.448);
  expect(result.totals.HP).toBe(1500);
  expect(result.totals.DEF).toBe(500);
  expect(result.totals.SPD).toBeCloseTo(114.6);
  expect(result.warnings).toHaveLength(5);
});
test('set thresholds apply only catalogue static properties and keep A snapshots stable',()=>{
  const a:Loadout={Hands:relic,Head:{...relic,id:'2',slot:'Head',mainStat:'HP',substats:[]}};
  expect(calculateBuild(profile,a).totals.ATK).toBeCloseTo(898.448);
  const b=structuredClone(a); b.Body={...relic,id:'3',slot:'Body',mainStat:'DEF',substats:[]}; b.Feet={...relic,id:'4',slot:'Feet',mainStat:'DEF',substats:[]};
  expect(calculateBuild(profile,b).totals.SPD-calculateBuild(profile,a).totals.SPD).toBeCloseTo(6);
  expect(a.Body).toBeUndefined();
  expect(calculateBuild(profile,b).activeSets).toHaveLength(2);
  expect(calculateBuild(profile,{Hands:{...relic,setId:'future'}}).warnings).toContain('Unknown set future: no bonus applied.');
});
test('invalid profiles, wrong slots and conflicting equipped records fail explicitly',()=>{
  expect(()=>calculateBuild({...profile,base:{...profile.base,SPD:0}},{})).toThrow('SPD');
  expect(()=>calculateBuild({...profile,corrections:{SPD:NaN}},{})).toThrow('finite');
  expect(()=>calculateBuild(profile,{Head:relic})).toThrow('Wrong relic slot');
  expect(()=>equippedLoadout([relic,{...relic,id:'2'}],'1308')).toThrow('Multiple');
});
