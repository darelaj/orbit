import {calculateBuild,validateProfile,type BuildProfile,type Loadout} from './comparison';
import {inventorySlots,type InventoryRelic,type InventorySlot} from './inventory';

export type Objective='ATK'|'HP'|'DEF'|'SPD'|'Break Effect_'|'crit-index';
export type SearchOptions={mode:'exact'|'limited';budget:number;objective:Objective;minSPD?:number;maxSPD?:number;requiredSets:{id:string;pieces:number}[];includeLocked:boolean;includeDiscarded:boolean;includeEquipped:boolean;excludeIds:string[];mainStats:Partial<Record<InventorySlot,string>>};
export type SearchInput={profile:BuildProfile;relics:InventoryRelic[];options:SearchOptions};
export type SearchResult={score:number;loadout:Loadout;totals:ReturnType<typeof calculateBuild>['totals'];warnings:string[]};
export type SearchReport={results:SearchResult[];total:string;evaluated:number;feasible:number;invalid:number;invalidReasons:string[];exhaustive:boolean;counts:number[]};
export type Progress=Pick<SearchReport,'total'|'evaluated'|'feasible'|'invalid'>;
export const defaultOptions:SearchOptions={mode:'exact',budget:100000,objective:'ATK',requiredSets:[],includeLocked:true,includeDiscarded:false,includeEquipped:true,excludeIds:[],mainStats:{}};
export function objectiveScore(totals:SearchResult['totals'],objective:Objective):number {
  return objective==='crit-index'?totals.ATK*(1+Math.min(100,Math.max(0,totals['CRIT Rate_']))/100*Math.max(0,totals['CRIT DMG_'])/100):totals[objective];
}
function validate(options:SearchOptions){
  if(!['exact','limited'].includes(options.mode)||!['ATK','HP','DEF','SPD','Break Effect_','crit-index'].includes(options.objective))throw new Error('Unsupported search mode or objective.');
  if(!Number.isInteger(options.budget)||options.budget<1||options.budget>1000000)throw new Error('Evaluation budget must be 1–1,000,000.');
  for(const value of [options.minSPD,options.maxSPD])if(value!==undefined&&(!Number.isFinite(value)||value<0))throw new Error('SPD bounds must be finite nonnegative numbers.');
  if(options.minSPD!==undefined&&options.maxSPD!==undefined&&options.minSPD>options.maxSPD)throw new Error('Minimum SPD exceeds maximum SPD.');
  const seen=new Set<string>();
  for(const set of options.requiredSets){if(!set.id.trim()||seen.has(set.id)||![2,4].includes(set.pieces))throw new Error('Required sets need unique IDs and 2 or 4 pieces.');seen.add(set.id);}
  if(options.requiredSets.reduce((sum,s)=>sum+s.pieces,0)>6)throw new Error('Required set counts exceed six slots.');
}
export function* optimize(input:SearchInput):Generator<Progress,SearchReport,void>{
  validateProfile(input.profile);validate(input.options);
  if(input.relics.length>10000)throw new Error('Maximum inventory size is 10,000 relics.');
  const {options}=input;const excluded=new Set(options.excludeIds);const ids=new Set<string>();
  for(const relic of input.relics){if(ids.has(relic.id))throw new Error(`Duplicate scanner ID ${relic.id}`);ids.add(relic.id);}
  const groups=inventorySlots.map(slot=>input.relics.filter(r=>r.slot===slot&&(!options.mainStats[slot]||r.mainStat===options.mainStats[slot])&&(options.includeLocked||!r.locked)&&(options.includeDiscarded||!r.discarded)&&(options.includeEquipped||!r.location)&&!excluded.has(r.id)));
  const missing=inventorySlots.filter((_,i)=>groups[i].length===0);if(missing.length)throw new Error(`No eligible relics for: ${missing.join(', ')}.`);
  const count=groups.reduce((total,g)=>total*BigInt(g.length),1n);const total=count.toString();
  if(options.mode==='exact'&&count>BigInt(options.budget))throw new Error(`Exact search needs ${total} evaluations. Increase filters/budget or choose limited sampling.`);
  const limit=Number(count<BigInt(options.budget)?count:BigInt(options.budget));
  const report:SearchReport={results:[],total,evaluated:0,feasible:0,invalid:0,invalidReasons:[],exhaustive:count<=BigInt(limit),counts:groups.map(g=>g.length)};
  for(let i=0;i<limit;i++){
    let index=report.exhaustive?BigInt(i):count*BigInt(i)/BigInt(limit);
    const loadout:Loadout={};const sets=new Map<string,number>();
    for(let slot=groups.length-1;slot>=0;slot--){const group=groups[slot];const r=group[Number(index%BigInt(group.length))];index/=BigInt(group.length);loadout[inventorySlots[slot]]=r;sets.set(r.setId,(sets.get(r.setId)??0)+1);}
    report.evaluated++;
    if(options.requiredSets.every(s=>(sets.get(s.id)??0)>=s.pieces)){
      try{
        const calculated=calculateBuild(input.profile,loadout);const speed=calculated.totals.SPD;
        if((options.minSPD===undefined||speed>=options.minSPD)&&(options.maxSPD===undefined||speed<=options.maxSPD)){
          const score=objectiveScore(calculated.totals,options.objective);if(!Number.isFinite(score))throw new Error('Objective overflow. Check imported values and profile.');report.feasible++;
          const result:SearchResult={score,loadout,totals:calculated.totals,warnings:calculated.warnings};
          report.results.push(result);report.results.sort((a,b)=>b.score-a.score||inventorySlots.map(s=>a.loadout[s]!.id).join('\0').localeCompare(inventorySlots.map(s=>b.loadout[s]!.id).join('\0')));report.results.length=Math.min(10,report.results.length);
        }
      }catch(error){report.invalid++;const reason=error instanceof Error?error.message:'Build calculation failed.';if(report.invalidReasons.length<3&&!report.invalidReasons.includes(reason))report.invalidReasons.push(reason);}
    }
    if(report.evaluated%1000===0)yield {total,evaluated:report.evaluated,feasible:report.feasible,invalid:report.invalid};
  }
  return report;
}
export function runSearch(input:SearchInput):SearchReport{const generator=optimize(input);let step=generator.next();while(!step.done)step=generator.next();return step.value;}
