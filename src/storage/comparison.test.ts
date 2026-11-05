import 'fake-indexeddb/auto';
import {expect,test} from 'vitest';
import {decodeComparisons,encodeComparisons,loadComparisons,saveComparisons} from './comparison';
import {emptyProfile,type Comparison} from '../domain/comparison';
import {parseInventory} from '../domain/inventory';
import {saveInventory} from './inventory';
test('saved profile and relic snapshots survive inventory replacement independently',async()=>{
  const inventory=parseInventory(JSON.stringify({source:'HSR-Scanner',version:4,relics:[{_uid:'1',set_id:'102',name:'Musketeer',slot:'Head',rarity:5,level:0,mainstat:'HP',substats:[],location:'',lock:false,discard:false}]}));
  const pair:Comparison={name:'Original',profile:{...emptyProfile,name:'Manual',base:{HP:1000,ATK:500,DEF:400,SPD:100}},a:{Head:inventory.relics[0]},b:{},precision:'ocr'};
  await saveComparisons([pair]);
  await saveInventory({...inventory,relics:[]});
  expect(await loadComparisons()).toEqual([pair]);
  expect(decodeComparisons(encodeComparisons([pair]))).toEqual([pair]);
  expect(()=>decodeComparisons('{')).toThrow();
  expect(()=>encodeComparisons(Array(21).fill(pair))).toThrow('20');
  await expect(saveComparisons([{...pair,profile:{...pair.profile,base:{...pair.profile.base,SPD:NaN}}}])).rejects.toThrow();
  expect(await loadComparisons()).toEqual([pair]);
});
