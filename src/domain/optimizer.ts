import {calculateBuild,validateProfile,type BuildProfile,type Loadout} from './comparison';
import {inventorySlots,type InventoryRelic,type InventorySlot} from './inventory';
import {setKind} from './catalogue';

export const objectiveStats=['ATK','HP','DEF','SPD','CRIT Rate_','CRIT DMG_','Break Effect_'] as const;
export type TargetStat=typeof objectiveStats[number];
export type Objective=TargetStat|'cv'|'crit-index';
export type SearchOptions={mode:'exact'|'limited';budget:number;objective:Objective;goal?:'maximize'|'targets';minimums?:Partial<Record<TargetStat,number>>;maximums?:Partial<Record<TargetStat,number>>;minSPD?:number;maxSPD?:number;requiredSets:{id:string;pieces:number}[];includeLocked:boolean;includeDiscarded:boolean;includeEquipped:boolean;excludeIds:string[];mainStats:Partial<Record<InventorySlot,string>>};
export type SearchInput={profile:BuildProfile;relics:InventoryRelic[];options:SearchOptions};
export type SearchResult={score:number;loadout:Loadout;totals:ReturnType<typeof calculateBuild>['totals'];warnings:string[]};
export type MissedBound={stat:TargetStat;minimum?:number;maximum?:number;builds:number};
export type SearchReport={results:SearchResult[];total:string;evaluated:number;feasible:number;invalid:number;invalidReasons:string[];exhaustive:boolean;counts:number[];rejected:number;missedBounds:MissedBound[]};
export type Progress=Pick<SearchReport,'total'|'evaluated'|'feasible'|'invalid'>;
export const defaultOptions:SearchOptions={mode:'exact',budget:100000,objective:'ATK',requiredSets:[],includeLocked:true,includeDiscarded:false,includeEquipped:true,excludeIds:[],mainStats:{}};
export function objectiveScore(totals:SearchResult['totals'],objective:Objective):number {
  if(objective==='cv')return 2*totals['CRIT Rate_']+totals['CRIT DMG_'];
  return objective==='crit-index'?totals.ATK*(1+Math.min(100,Math.max(0,totals['CRIT Rate_']))/100*Math.max(0,totals['CRIT DMG_'])/100):totals[objective];
}
export type TargetOptions=Pick<SearchOptions,'goal'|'minimums'|'maximums'|'minSPD'|'maxSPD'>;
export function targetBounds(options:TargetOptions){
  if(options.goal!==undefined&&!['maximize','targets'].includes(options.goal))throw new Error('Unsupported search goal.');
  for(const field of ['minimums','maximums'] as const){const values=options[field];if(values!==undefined&&(values===null||typeof values!=='object'||Array.isArray(values)||(Object.getPrototypeOf(values)!==Object.prototype&&Object.getPrototypeOf(values)!==null)))throw new Error(`${field}: expected stat bounds.`);for(const [key,value] of Object.entries(values??{})){if(!objectiveStats.includes(key as TargetStat)||(value!==undefined&&(typeof value!=='number'||!Number.isFinite(value)||value<0)))throw new Error(`${field}.${key}: expected a supported stat and finite nonnegative threshold.`);}}
  if(options.minSPD!==undefined&&options.minimums?.SPD!==undefined||options.maxSPD!==undefined&&options.maximums?.SPD!==undefined)throw new Error('Duplicate SPD bounds: use one input per minimum/maximum.');
  const bounds=objectiveStats.map(stat=>({stat,minimum:stat==='SPD'?options.minSPD??options.minimums?.SPD:options.minimums?.[stat],maximum:stat==='SPD'?options.maxSPD??options.maximums?.SPD:options.maximums?.[stat]}));
  for(const bound of bounds){for(const value of [bound.minimum,bound.maximum])if(value!==undefined&&(!Number.isFinite(value)||value<0))throw new Error(`${bound.stat} bounds must be finite nonnegative numbers.`);if(bound.minimum!==undefined&&bound.maximum!==undefined&&bound.minimum>bound.maximum)throw new Error(`Minimum ${bound.stat} exceeds maximum.`);}
  if(options.goal==='targets'&&!bounds.some(b=>b.minimum!==undefined))throw new Error('Add at least one minimum target before searching.');
  return bounds.filter(b=>b.minimum!==undefined||b.maximum!==undefined);
}
export function validateSearchOptions(options:SearchOptions){
  if(!['exact','limited'].includes(options.mode)||![...objectiveStats,'cv','crit-index'].includes(options.objective))throw new Error('Unsupported search mode or objective.');
  if(!Number.isInteger(options.budget)||options.budget<1||options.budget>1000000)throw new Error('Evaluation budget must be 1–1,000,000.');
  const bounds=targetBounds(options);
  const seen=new Set<string>();
  let cavern=0,planar=0;
  for(const set of options.requiredSets){if(!set.id.trim()||seen.has(set.id)||![2,4].includes(set.pieces))throw new Error('Required sets need unique IDs and 2 or 4 pieces.');seen.add(set.id);const kind=setKind(set.id);if(!kind)throw new Error(`Unknown required set ${set.id}. Choose a catalogued set.`);if(kind==='planar'){if(set.pieces!==2)throw new Error('Planar sets require two pieces, never four.');planar+=set.pieces;}else cavern+=set.pieces;}
  if(cavern>4||planar>2)throw new Error('Required sets exceed four Cavern or two Planar slots.');
  return bounds;
}
export function candidateGroups(relics:InventoryRelic[],options:SearchOptions,excluded=new Set(options.excludeIds)){
  return inventorySlots.map(slot=>relics.filter(r=>r.slot===slot&&(!options.mainStats[slot]||r.mainStat===options.mainStats[slot])&&(options.includeLocked||!r.locked)&&(options.includeDiscarded||!r.discarded)&&(options.includeEquipped||!r.location)&&!excluded.has(r.id)));
}
export function* optimize(input:SearchInput):Generator<Progress,SearchReport,void>{
  validateProfile(input.profile);const bounds=validateSearchOptions(input.options);
  if(input.relics.length>10000)throw new Error('Maximum inventory size is 10,000 relics.');
  const {options}=input;const excluded=new Set(options.excludeIds);const ids=new Set<string>();
  for(const relic of input.relics){if(ids.has(relic.id))throw new Error(`Duplicate scanner ID ${relic.id}`);ids.add(relic.id);}
  const groups=candidateGroups(input.relics,options,excluded);
  const missing=inventorySlots.filter((_,i)=>groups[i].length===0);if(missing.length)throw new Error(`No eligible relics for: ${missing.join(', ')}.`);
  const count=groups.reduce((total,g)=>total*BigInt(g.length),1n);const total=count.toString();
  if(options.mode==='exact'&&count>BigInt(options.budget))throw new Error(`Exact search needs ${total} evaluations. Increase filters/budget or choose limited sampling.`);
  const limit=Number(count<BigInt(options.budget)?count:BigInt(options.budget));
  const report:SearchReport={results:[],total,evaluated:0,feasible:0,invalid:0,invalidReasons:[],exhaustive:count<=BigInt(limit),counts:groups.map(g=>g.length),rejected:0,missedBounds:bounds.map(b=>({...b,builds:0}))};
  for(let i=0;i<limit;i++){
    let index=report.exhaustive?BigInt(i):count*BigInt(i)/BigInt(limit);
    const loadout:Loadout={};const sets=new Map<string,number>();
    for(let slot=groups.length-1;slot>=0;slot--){const group=groups[slot];const r=group[Number(index%BigInt(group.length))];index/=BigInt(group.length);loadout[inventorySlots[slot]]=r;sets.set(r.setId,(sets.get(r.setId)??0)+1);}
    report.evaluated++;
    if(options.requiredSets.every(s=>(sets.get(s.id)??0)>=s.pieces)){
      try{
        const calculated=calculateBuild(input.profile,loadout);
        const failures=report.missedBounds.filter(b=>(b.minimum!==undefined&&calculated.totals[b.stat]<b.minimum)||(b.maximum!==undefined&&calculated.totals[b.stat]>b.maximum));
        for(const failure of failures)failure.builds++;
        if(!failures.length){
          const score=objectiveScore(calculated.totals,options.objective);if(!Number.isFinite(score))throw new Error('Objective overflow. Check imported values and profile.');report.feasible++;
          const warnings=calculated.totals['CRIT Rate_']>100?[...calculated.warnings,'CRIT Rate exceeds 100%; raw CV is not capped and may include wasted CRIT Rate.']:calculated.warnings;
          const result:SearchResult={score,loadout,totals:calculated.totals,warnings};
          report.results.push(result);report.results.sort((a,b)=>{if(a.score!==b.score)return b.score-a.score;for(const slot of inventorySlots){const left=a.loadout[slot]!.id,right=b.loadout[slot]!.id;if(left!==right)return left<right?-1:1;}return 0;});report.results.length=Math.min(10,report.results.length);
        }else report.rejected++;
      }catch(error){report.invalid++;const reason=error instanceof Error?error.message:'Build calculation failed.';if(report.invalidReasons.length<3&&!report.invalidReasons.includes(reason))report.invalidReasons.push(reason);}
    }else report.rejected++;
    if(report.evaluated%1000===0)yield {total,evaluated:report.evaluated,feasible:report.feasible,invalid:report.invalid};
  }
  return report;
}
export function runSearch(input:SearchInput):SearchReport{const generator=optimize(input);let step=generator.next();while(!step.done)step=generator.next();return step.value;}
