import {simulateSpeed,type SpeedMember,type SpeedTeam} from '../domain/speed';
import {openWorkspace} from './inventory';
export const MAX_TEAM_BYTES=16384;
export function encodeTeam(team:SpeedTeam):string{simulateSpeed(team);return JSON.stringify({format:'orbit-speed-team',schemaVersion:1,team});}
export function decodeTeam(text:string):SpeedTeam{
  if(new TextEncoder().encode(text).length>MAX_TEAM_BYTES)throw new Error('Team backup exceeds 16 KiB.');
  function object(value:unknown):Record<string,unknown>{if(!value||typeof value!=='object'||Array.isArray(value))throw new Error('Invalid team backup.');return value as Record<string,unknown>;}
  const root=object(JSON.parse(text));if(root.format!=='orbit-speed-team'||root.schemaVersion!==1)throw new Error('Unsupported speed-team backup.');
  const raw=object(root.team);if(!Array.isArray(raw.members)||raw.members.length!==4||typeof raw.cycles!=='number')throw new Error('Invalid team shape.');
  const members=raw.members.map(value=>{
    const m=object(value);for(const key of ['baseSPD','panelSPD','buffPercent','flatBuff','advance'])if(typeof m[key]!=='number')throw new Error('Invalid speed input.');
    if(typeof m.name!=='string'||typeof m.source!=='string'||typeof m.precision!=='string'||!['manual','packet','ocr','unknown'].includes(m.precision))throw new Error('Invalid team provenance.');
    return {name:m.name,source:m.source,precision:m.precision as SpeedMember['precision'],baseSPD:m.baseSPD as number,panelSPD:m.panelSPD as number,buffPercent:m.buffPercent as number,flatBuff:m.flatBuff as number,advance:m.advance as number};
  });
  const team={cycles:raw.cycles,members};simulateSpeed(team);return team;
}
export async function loadTeam():Promise<SpeedTeam|null>{const db=await openWorkspace();try{const raw=await new Promise<unknown>((resolve,reject)=>{const request=db.transaction('workspace').objectStore('workspace').get('speed-team');request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(new Error('Could not load speed team.'));});if(raw===undefined)return null;if(typeof raw!=='string')throw new Error('Invalid saved speed team.');return decodeTeam(raw);}finally{db.close();}}
export async function saveTeam(team:SpeedTeam):Promise<void>{const text=encodeTeam(team);const db=await openWorkspace();try{await new Promise<void>((resolve,reject)=>{const tx=db.transaction('workspace','readwrite');tx.objectStore('workspace').put(text,'speed-team');tx.oncomplete=()=>resolve();tx.onerror=tx.onabort=()=>reject(new Error('Team could not be saved. Previous configuration is unchanged.'));});}finally{db.close();}}
