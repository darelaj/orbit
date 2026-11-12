import {defaultOptions,objectiveStats,type SearchOptions,type TargetStat} from '../../domain/optimizer';
import {setKind} from '../../domain/catalogue';
import setData from '../../data/relic-sets.json';
import {inventorySlots,type Inventory} from '../../domain/inventory';

export type BuildGoal={choice:''|'cv'|'stat'|'targets';options:SearchOptions;borrow:boolean};
export const newBuildGoal=():BuildGoal=>({choice:'',options:structuredClone(defaultOptions),borrow:false});
export const statLabel=(key:string)=>key==='cv'?'Build CV':key==='crit-index'?'ATK/CRIT index (not DPS)':key.replace('_',' %');

export default function GoalControls({value,onChange,inventory}:{value:BuildGoal;onChange:(next:BuildGoal)=>void;inventory:Inventory|null}){
  const {options}=value;
  const update=(patch:Partial<SearchOptions>)=>onChange({...value,options:{...options,...patch}});
  const cavern=options.requiredSets.filter(s=>setKind(s.id)!=='planar');
  const planar=options.requiredSets.find(s=>setKind(s.id)==='planar');
  const setNames:Record<string,{name:string}>=setData;
  const choices=[...new Map(inventory?.relics.map(r=>[r.setId,Object.hasOwn(setNames,r.setId)?setNames[r.setId].name:r.setName] as const)).entries()];
  function chooseSet(kind:'cavern'|'planar',index:number,id:string){
    const group=kind==='cavern'?[...cavern]:planar?[planar]:[];
    if(id)group[index]={id,pieces:group[index]?.pieces??2};else group.splice(index,1);
    update({requiredSets:kind==='cavern'?[...group,...(planar?[planar]:[])]:[...cavern,...group]});
  }
  function setSelect(kind:'cavern'|'planar',index:number,label:string){
    const selected=kind==='cavern'?cavern[index]:planar;
    return <label>{label}<select value={selected?.id??''} onChange={e=>chooseSet(kind,index,e.target.value)}><option value="">Any set</option>{selected&&!choices.some(([id])=>id===selected.id)&&<option value={selected.id}>Set {selected.id} (unavailable)</option>}{choices.filter(([id])=>setKind(id)===kind).map(([id,name])=><option key={id} value={id}>{name}</option>)}</select></label>;
  }
  const minimumKeys=[...new Set<TargetStat>(['SPD',...Object.keys(options.minimums??{}) as TargetStat[]])];
  return <div className="goal-controls">
    <label>Goal<select value={value.choice} onChange={e=>{const choice=e.target.value as BuildGoal['choice'];onChange({...value,choice,options:{...options,goal:choice==='targets'?'targets':'maximize',minimums:choice==='targets'?options.minimums:undefined,objective:choice==='cv'?'cv':options.objective==='cv'?'ATK':options.objective}});}}><option value="">Choose a goal</option><option value="cv">Maximize CV</option><option value="stat">Maximize a stat</option><option value="targets">Reach targets, then maximize</option></select></label>
    {value.choice&&value.choice!=='cv'&&<label>{value.choice==='targets'?'Then maximize':'Stat'}<select value={options.objective} onChange={e=>update({objective:e.target.value as SearchOptions['objective']})}>{[...objectiveStats,'cv','crit-index'].map(key=><option key={key} value={key}>{statLabel(key)}</option>)}</select></label>}
    {value.choice==='targets'&&<fieldset><legend>Minimum targets</legend><div className="optimizer-fields">{minimumKeys.map(stat=><div key={stat}><label>Minimum {statLabel(stat)}<input type="number" min="0" step="any" value={options.minimums?.[stat]??''} onChange={e=>update({minimums:{...options.minimums,[stat]:e.target.value===''?undefined:Number(e.target.value)}})}/></label>{stat!=='SPD'&&<button onClick={()=>{const next={...options.minimums};delete next[stat];update({minimums:next});}}>Remove {statLabel(stat)} minimum</button>}</div>)}</div><label>Add minimum<select value="" onChange={e=>{if(e.target.value)update({minimums:{...options.minimums,[e.target.value]:undefined}});}}><option value="">Choose another stat</option>{objectiveStats.filter(s=>!minimumKeys.includes(s)).map(s=><option key={s} value={s}>{statLabel(s)}</option>)}</select></label><p>Every minimum is required. Extra SPD earns no bonus when maximizing another stat.</p></fieldset>}
    <fieldset><legend>Required sets</legend><div className="optimizer-fields">{setSelect('cavern',0,'Cavern set')}{cavern[0]&&<label>Cavern pieces<select value={cavern[0].pieces} onChange={e=>update({requiredSets:[{...cavern[0],pieces:Number(e.target.value)},...(Number(e.target.value)===2?cavern.slice(1):[]),...(planar?[planar]:[])]})}><option value={2}>Two pieces</option><option value={4}>Four pieces</option></select></label>}{cavern[0]?.pieces===2&&setSelect('cavern',1,'Second Cavern set (optional)')}{setSelect('planar',0,'Planar set')}</div></fieldset>
    <label className="goal-borrow"><input type="checkbox" checked={value.borrow} onChange={e=>onChange({...value,borrow:e.target.checked})}/>Borrow from other characters</label>
    <details><summary>Advanced search settings</summary><div className="optimizer-fields"><label>Search mode<select value={options.mode} onChange={e=>update({mode:e.target.value as SearchOptions['mode']})}><option value="exact">Exact search</option><option value="limited">Quick search (limited sampling)</option></select></label><label>Evaluation budget<select value={options.budget} onChange={e=>update({budget:Number(e.target.value)})}>{[1000,10000,100000,1000000].map(n=><option key={n}>{n}</option>)}</select></label></div>
      <p>Quick search can miss matching or better builds. Exact never switches to quick automatically.</p>
      <div className="optimizer-checks">{(['includeLocked','includeDiscarded'] as const).map(key=><label key={key}><input type="checkbox" checked={options[key]} onChange={e=>update({[key]:e.target.checked})}/>{key==='includeLocked'?'Include locked relics':'Include discarded relics'}</label>)}</div>
      <label>Exclude scanner IDs (one per line)<textarea rows={3} value={options.excludeIds.join('\n')} onChange={e=>update({excludeIds:e.target.value.split('\n').map(s=>s.trim())})}/></label>
      <div className="optimizer-fields">{inventorySlots.map(slot=><label key={slot}>{slot} main stat<select value={options.mainStats[slot]??''} onChange={e=>update({mainStats:{...options.mainStats,[slot]:e.target.value}})}><option value="">Any main stat</option>{options.mainStats[slot]&&!inventory?.relics.some(r=>r.slot===slot&&r.mainStat===options.mainStats[slot])&&<option value={options.mainStats[slot]}>{options.mainStats[slot]} (unavailable in current inventory)</option>}{[...new Set(inventory?.relics.filter(r=>r.slot===slot).map(r=>r.mainStat))].map(s=><option key={s}>{s}</option>)}</select></label>)}</div>
      <div className="optimizer-fields">{objectiveStats.map(stat=><label key={stat}>Maximum {statLabel(stat)}<input type="number" min="0" step="any" value={options.maximums?.[stat]??''} onChange={e=>update({maximums:{...options.maximums,[stat]:e.target.value===''?undefined:Number(e.target.value)}})}/></label>)}</div>
    </details>
  </div>;
}
