import {useEffect,useLayoutEffect,useRef,useState} from 'react';
import {candidateGroups,validateSearchOptions,type SearchReport,type Progress} from '../../domain/optimizer';
import {validateProfile,type BuildProfile,type Loadout} from '../../domain/comparison';
import {assessCurrentBuild,assessCandidate,classifySearch} from '../../domain/assessment';
import {inventorySlots,type Inventory} from '../../domain/inventory';
import {OptimizerRunner} from './runner';
import {catalogueItem} from '../../domain/catalogue';
import {GameImage} from '../../app/Equipment';
import GoalControls,{statLabel,type BuildGoal} from './GoalControls';
import './optimizer.css';

export default function OptimizerWorkspace({inventory,profile,current,goal,onGoalChange,onApply,active}:{active:boolean;inventory:Inventory|null;profile:BuildProfile;current:Loadout;goal:BuildGoal;onGoalChange:(next:BuildGoal)=>void;onApply:(loadout:Loadout)=>void}){
  const {options}=goal;
  const owner=profile.origin?.characterId??profile.characterId;
  const pool=inventory?.relics.filter(r=>!r.location||r.location===owner||goal.borrow)??[];
  const groups=candidateGroups(pool,options);
  const combinations=groups.reduce((total,g)=>total*BigInt(g.length),1n);
  let blocked='';
  try{if(!inventory)throw new Error('Import inventory to find builds.');validateProfile(profile);if(!goal.choice)throw new Error('Choose a goal before searching.');validateSearchOptions(options);const missing=inventorySlots.filter((_,i)=>!groups[i].length);if(missing.length)throw new Error(`No eligible relics for: ${missing.join(', ')}. Edit the pool or filters.`);if(options.mode==='exact'&&combinations>BigInt(options.budget))throw new Error(`Exact search needs ${combinations} evaluations. Narrow the relic pool or explicitly choose quick search.`);}catch(e){blocked=e instanceof Error?e.message:'Review the search inputs.';}
  const [cancelled,setCancelled]=useState(false);
  const [error,setError]=useState('');const [running,setRunning]=useState(false);const [report,setReport]=useState<SearchReport|null>(null);const [progress,setProgress]=useState<Progress|null>(null);
  const [selected,setSelected]=useState(0);
  const revision=useRef(0);
  const [runner]=useState(()=>new OptimizerRunner(()=>new Worker(new URL('../../workers/optimizer.worker.ts',import.meta.url),{type:'module'}),message=>{
    if(message.kind==='progress')setProgress(message.progress);
    else {setRunning(false);if(message.kind==='error')setError(message.message);else{setReport(message.report);setSelected(0);}}
  }));
  useLayoutEffect(()=>{revision.current++;runner.invalidate(revision.current);setRunning(false);setReport(null);setProgress(null);setError('');setCancelled(false);},[inventory,profile,current,goal,runner,active]);
  useEffect(()=>()=>runner.cancel(),[runner]);
  function start(){if(blocked)return;setCancelled(false);setReport(null);setProgress(null);setError('');try{setRunning(true);runner.start({profile:structuredClone(profile),relics:pool,options:structuredClone(options)},revision.current);}catch(e){setRunning(false);setError(e instanceof Error?e.message:'Could not start search.');}}
  function cancel(){runner.cancel();setRunning(false);setProgress(null);setReport(null);setError('');setCancelled(true);}
  const classification=classifySearch(report);
  const result=report?.results[selected];
  let delta:ReturnType<typeof assessCandidate>|null=null;let deltaError='';
  if(result)try{delta=assessCandidate(profile,current,result.loadout,options.objective);}catch(e){deltaError=e instanceof Error?e.message:'Current build cannot be compared.';}
  return <section className="optimizer-workspace" aria-label="Relic optimizer">
    <h3>Find a better build</h3><p>Choose what matters for this character. Search uses static panel stats, not combat damage.</p>
    <div className="build-search-layout"><div><GoalControls value={goal} onChange={onGoalChange} inventory={inventory}/>
      <p>{groups.reduce((sum,g)=>sum+g.length,0)} eligible relics · {goal.borrow?'Borrowing enabled':'Unequipped + this character only'} · {pool.filter(r=>r.location&&r.location!==owner).length} relics from other characters in scope.</p>
      <p>{options.mode==='exact'?'Exact search':'Quick search: limited coverage'} · {Object.values(options.maximums??{}).filter(v=>v!==undefined).length} maximum constraints.</p>
      {blocked&&<p id="search-blocked" role="status">{blocked}</p>}
      {options.mode==='exact'&&combinations>BigInt(options.budget)&&<button onClick={()=>onGoalChange({...goal,options:{...options,mode:'limited'}})}>Use quick search</button>}
      <div className="comparison-toolbar">{running?<button onClick={cancel}>Cancel search</button>:<button className="primary" disabled={!!blocked} aria-describedby={blocked?'search-blocked':undefined} onClick={start}>Find builds</button>}</div>
      {running&&<p role="status">Searching… {progress?`${progress.evaluated} / ${progress.total} combinations · ${progress.feasible} matching`:'Preparing relic pool'}</p>}{error&&<p role="alert">{error}</p>}{cancelled&&<p role="status">Search cancelled. No build was applied.</p>}
    </div><section aria-label="Optimizer results" className="build-search-results">
      {!report?<p>{running?'Results will appear when the search completes.':'Choose a goal and find builds to see upgrades here.'}</p>:<>
        <h3>{classification.kind==='exact-optimum'?'Best in this relic pool':classification.kind==='best-found'?'Best found':classification.kind==='no-feasible'?'No build meets these targets in this relic pool':'No matching build found in this search'}</h3>
        <p>{report.exhaustive?'All filtered combinations evaluated.':'Incomplete coverage: matching or better builds may exist.'} Results apply only to this static model and selected pool.</p>
        {report.invalid>0&&<p>{report.invalid} invalid calculations excluded; no unqualified optimum is claimed.</p>}
        {result&&<><ol className="build-result-list">{report.results.map((r,i)=><li key={i}><button aria-pressed={i===selected} onClick={()=>setSelected(i)}>Inspect build {i+1} · {statLabel(options.objective)} {r.score.toFixed(3)}</button></li>)}</ol>
          <h4>Build {selected+1} · {statLabel(options.objective)} {result.score.toFixed(3)}</h4>
          <p>SPD {result.totals.SPD.toFixed(3)} · CRIT Rate {result.totals['CRIT Rate_'].toFixed(3)}% · CRIT DMG {result.totals['CRIT DMG_'].toFixed(3)}%</p>
          <p>{assessCurrentBuild(profile,result.loadout,options).targets.status==='met'?'Targets met':goal.choice==='targets'?'Review target status':'No minimum targets selected'}</p>
          {delta&&<p>{delta.currentPartial?'Compared with partial current equipment':'Compared with the reference build'}: {delta.changedSlots.length} changed slots · {statLabel(options.objective)} change {delta.objectiveChange>=0?'+':''}{delta.objectiveChange.toFixed(3)} · SPD change {delta.stats.find(s=>s.key==='SPD')!.delta.toFixed(3)}</p>}{deltaError&&<p>{deltaError}</p>}
          <div className="optimizer-result-slots">{inventorySlots.map(slot=>{const r=result.loadout[slot]!;const item=catalogueItem(r);return <span key={slot}>{item&&<GameImage file={`relic/${item.icon}`} alt=""/>}<strong>{slot}</strong><span>{item?.name??r.setName}</span><small>{r.location&&r.location!==owner?`Borrowed from ${r.location}`:r.location?'Currently equipped':'Unequipped'}</small></span>;})}</div>
          {result.warnings.map(w=><p key={w}>{w}</p>)}<button className="primary" onClick={()=>onApply(structuredClone(result.loadout))}>Compare build</button>
        </>}
        <details><summary>Search coverage and constraints</summary><p>{report.evaluated} / {report.total} combinations · {report.feasible} matching · {report.rejected} rejected · {report.invalid} invalid. Up to ten results retained.</p><p>{inventorySlots.map((s,i)=>`${s}: ${report.counts[i]}`).join(' · ')}</p>{report.invalidReasons.map(reason=><p key={reason}>{reason}</p>)}{report.missedBounds.map(bound=><p key={bound.stat}>{statLabel(bound.stat)}: {bound.builds} evaluated, calculable builds missed this bound. Counts can overlap.</p>)}</details>
      </>}
      <details><summary>Calculation limits</summary><p>Static set properties only. Conditional effects, major Traces, Eidolons, Light Cone passives and combat rotations are excluded. CV is 2 × CRIT Rate + CRIT DMG, including this profile and modeled static bonuses; raw CRIT Rate is uncapped. The ATK/CRIT index is not DPS.</p></details>
    </section></div>
  </section>;
}
