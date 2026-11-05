import {useEffect,useLayoutEffect,useRef,useState} from 'react';
import {defaultOptions,type SearchOptions,type SearchReport,type Progress} from '../../domain/optimizer';
import {validateProfile,type BuildProfile,type Loadout} from '../../domain/comparison';
import {inventorySlots,type Inventory} from '../../domain/inventory';
import {OptimizerRunner} from './runner';
import {catalogueItem} from '../../domain/catalogue';
import {GameImage} from '../../app/Equipment';
import './optimizer.css';

export default function OptimizerWorkspace({inventory,profile,onApply,active}:{active:boolean;inventory:Inventory|null;profile:BuildProfile;onApply:(loadout:Loadout)=>void}){
  const [options,setOptions]=useState<SearchOptions>(structuredClone(defaultOptions));
  const [cancelled,setCancelled]=useState(false);
  const [excludeText,setExcludeText]=useState('');const [error,setError]=useState('');const [running,setRunning]=useState(false);const [report,setReport]=useState<SearchReport|null>(null);const [progress,setProgress]=useState<Progress|null>(null);
  const revision=useRef(0);
  const [runner]=useState(()=>new OptimizerRunner(()=>new Worker(new URL('../../workers/optimizer.worker.ts',import.meta.url),{type:'module'}),message=>{
    if(message.kind==='progress')setProgress(message.progress);
    else {setRunning(false);if(message.kind==='error')setError(message.message);else setReport(message.report);}
  }));
  useLayoutEffect(()=>{revision.current++;runner.invalidate(revision.current);setRunning(false);setReport(null);setProgress(null);setError('');setCancelled(false);},[inventory,profile,options,runner,active]);
  useEffect(()=>()=>runner.cancel(),[runner]);
  function start(){setCancelled(false);setReport(null);setProgress(null);setError('');try{if(!inventory)throw new Error('Import inventory before optimizing.');validateProfile(profile);setRunning(true);runner.start({profile:structuredClone(profile),relics:inventory.relics,options:structuredClone(options)},revision.current);}catch(e){setRunning(false);setError(e instanceof Error?e.message:'Could not start optimizer.');}}
  function cancel(){runner.cancel();setRunning(false);setProgress(null);setReport(null);setError('');setCancelled(true);}
  const setChoices=[...new Map(inventory?.relics.map(r=>[r.setId,r.setName])).entries()];
  return <section className="optimizer-workspace" aria-label="Relic optimizer">
    <h3>Relic optimizer</h3><p>Uses the shared manual profile above and the current imported inventory. Complete six-slot builds only. Static set bonuses follow the comparison model; conditional effects and combat simulation remain excluded.</p>
    <p>Exact enumerates every filtered combination within the budget. Limited sampling is heuristic: it tests evenly spaced combinations in scanner order, can miss feasible or better builds, and offers no global optimum guarantee. Editing inputs or importing inventory invalidates the run and results.</p>
    <p>{inventory?`${inventory.relics.length} imported relics · ${inventory.precision==='ocr'?'OCR: hidden SPD decimals unavailable':'Packet-derived precision retained'}`:'No imported inventory.'}</p>
    <div className="optimizer-fields">
      <label>Objective<select value={options.objective} onChange={e=>setOptions({...options,objective:e.target.value as SearchOptions['objective']})}>{['ATK','HP','DEF','SPD','Break Effect_','crit-index'].map(s=><option key={s} value={s}>{s==='crit-index'?'ATK/CRIT index (not DPS)':s.replace('_',' %')}</option>)}</select></label>
      <label>Search mode<select value={options.mode} onChange={e=>setOptions({...options,mode:e.target.value as SearchOptions['mode']})}><option value="exact">Exact · exhaustive filtered pool</option><option value="limited">Limited sampling · heuristic</option></select></label>
      <label>Evaluation budget<select value={options.budget} onChange={e=>setOptions({...options,budget:Number(e.target.value)})}>{[1000,10000,100000,1000000].map(n=><option key={n}>{n}</option>)}</select></label>
      <label>Minimum SPD<input type="number" min="0" step="any" value={options.minSPD??''} onChange={e=>setOptions({...options,minSPD:e.target.value===''?undefined:Number(e.target.value)})} /></label>
      <label>Maximum SPD<input type="number" min="0" step="any" value={options.maxSPD??''} onChange={e=>setOptions({...options,maxSPD:e.target.value===''?undefined:Number(e.target.value)})} /></label>
    </div>
    <details><summary>Candidate eligibility and required sets</summary><div className="optimizer-checks">{(['includeLocked','includeDiscarded','includeEquipped'] as const).map(key=><label key={key}><input type="checkbox" checked={options[key]} onChange={e=>setOptions({...options,[key]:e.target.checked})} />{({includeLocked:'Include locked relics',includeDiscarded:'Include discarded relics',includeEquipped:'Include equipped relics'})[key]}</label>)}</div>
      <label>Exclude scanner IDs (one per line)<textarea rows={3} value={excludeText} onChange={e=>{setExcludeText(e.target.value);setOptions({...options,excludeIds:e.target.value.split('\n').map(s=>s.trim()).filter(Boolean)});}} /></label>
      <div className="optimizer-fields">{inventorySlots.map(slot=><label key={slot}>{slot} main stat<select value={options.mainStats[slot]??''} onChange={e=>setOptions({...options,mainStats:{...options.mainStats,[slot]:e.target.value}})}><option value="">Any</option>{options.mainStats[slot] && !inventory?.relics.some(r=>r.slot===slot&&r.mainStat===options.mainStats[slot]) && <option value={options.mainStats[slot]}>{options.mainStats[slot]} (unavailable in current inventory)</option>}{[...new Set(inventory?.relics.filter(r=>r.slot===slot).map(r=>r.mainStat))].sort().map(s=><option key={s}>{s}</option>)}</select></label>)}</div>
      {options.requiredSets.map((requirement,i)=><div key={i} className="optimizer-fields"><label>Required set {i+1}<select value={requirement.id} onChange={e=>setOptions({...options,requiredSets:options.requiredSets.map((s,j)=>j===i?{...s,id:e.target.value}:s)})}><option value="">Choose set</option>{requirement.id && !setChoices.some(([id])=>id===requirement.id) && <option value={requirement.id}>Set {requirement.id} (unavailable in current inventory)</option>}{setChoices.map(([id,name])=><option key={id} value={id}>{name} ({id})</option>)}</select></label><label>Required pieces {i+1}<select value={requirement.pieces} onChange={e=>setOptions({...options,requiredSets:options.requiredSets.map((s,j)=>j===i?{...s,pieces:Number(e.target.value)}:s)})}><option>2</option><option>4</option></select></label><button onClick={()=>setOptions({...options,requiredSets:options.requiredSets.filter((_,j)=>i!==j)})}>Remove requirement {i+1}</button></div>)}
      <button disabled={options.requiredSets.length>=3} onClick={()=>setOptions({...options,requiredSets:[...options.requiredSets,{id:'',pieces:2}]})}>Add set requirement</button>
    </details>
    <div className="comparison-toolbar"><button disabled={running||!inventory} onClick={start}>Run optimizer</button><button disabled={!running} onClick={cancel}>Cancel search</button><button onClick={()=>{setOptions(structuredClone(defaultOptions));setExcludeText('');}}>Reset optimizer filters</button></div>
    {running&&<p role="status">Searching… {progress?`${progress.evaluated} / ${progress.total} combinations · ${progress.feasible} feasible`:'Preparing candidate pool'}</p>}{error&&<p role="alert">{error}</p>}{cancelled&&<p role="status">Search cancelled. No result was applied.</p>}
    {report&&<section aria-label="Optimizer results"><h3>{report.exhaustive?'Exhaustive filtered search':'Non-exhaustive sampled search'}</h3><p>{report.evaluated} evaluated / {report.total} filtered combinations · {report.feasible} feasible · {report.invalid} invalid calculations excluded. Kept the best {report.results.length} results (maximum 10).</p><p>Eligible candidates: {inventorySlots.map((s,i)=>`${s} ${report.counts[i]}`).join(' · ')}</p>{report.invalid>0&&<p>Excluded calculations could not be evaluated under this profile/catalogue. Results are ranked only among computable builds.</p>}{report.invalidReasons.map(reason=><p key={reason}>{reason}</p>)}{!report.results.length&&<p>{report.exhaustive?'No feasible computable build in the filtered pool.':'No feasible build found in this sample. A feasible build may still exist.'}</p>}
      {options.objective==='crit-index'&&<p>ATK × (1 + clamped CRIT Rate × CRIT DMG) is an index, not DPS. It excludes skill multipliers, enemy stats, damage bonuses and combat mechanics.</p>}
      <ol className="optimizer-results">{report.results.map((result,i)=><li key={inventorySlots.map(s=>result.loadout[s]!.id).join('|')}><h4>Result {i+1} · {options.objective==='crit-index'?'Index':'Score'} {result.score.toFixed(3)}</h4><p>ATK {result.totals.ATK.toFixed(3)} · HP {result.totals.HP.toFixed(3)} · SPD {result.totals.SPD.toFixed(3)}</p><div className="optimizer-result-slots">{inventorySlots.map(slot=>{const r=result.loadout[slot]!;const item=catalogueItem(r);return <span key={slot}>{item&&<GameImage file={`relic/${item.icon}`} alt="" />}<strong>{slot}</strong><span>{item?.name??r.setName}</span><small>ID {r.id}</small></span>;})}</div>{result.warnings.map(w=><p key={w}>{w}</p>)}<button onClick={()=>onApply(structuredClone(result.loadout))}>Compare result {i+1} in B</button></li>)}</ol>
    </section>}
  </section>;
}
