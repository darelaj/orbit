export type SpeedMember={name:string;baseSPD:number;panelSPD:number;buffPercent:number;flatBuff:number;advance:number;precision:'manual'|'packet'|'ocr'|'unknown';source:string};
export type SpeedTeam={members:SpeedMember[];cycles:number};
export type SpeedSource={name:string;baseSPD:number;panelSPD:number;precision:'packet'|'ocr'|'unknown'};
export type SpeedEvent={member:number;turn:number;av:number;cycle:number};
export const AV_EPSILON=1e-9;
export const MAX_EVENTS=2000;
export function defaultTeam():SpeedTeam{return {cycles:3,members:Array.from({length:4},(_,i)=>({name:`Member ${i+1}`,baseSPD:100,panelSPD:100,buffPercent:0,flatBuff:0,advance:0,precision:'manual',source:'Manual input'}))};}
export function cycleEnd(cycles:number){return 150+100*(cycles-1);}
export function requiredSPD(turns:number,cycles:number){if(!Number.isInteger(turns)||turns<1||turns>2000||!Number.isInteger(cycles)||cycles<1||cycles>20)throw new Error('Threshold needs 1–2000 turns and 1–20 cycles.');return 10000*turns/cycleEnd(cycles);}
export function effectiveSPD(member:SpeedMember){return member.panelSPD+member.baseSPD*member.buffPercent/100+member.flatBuff;}
export function validateTeam(team:SpeedTeam){
  if(!Number.isInteger(team.cycles)||team.cycles<1||team.cycles>20)throw new Error('Choose 1–20 cycles.');
  if(!Array.isArray(team.members)||team.members.length!==4)throw new Error('A speed team has exactly four members.');
  for(const [i,m] of team.members.entries()){
    const prefix=`Member ${i+1}`;
    if(typeof m.name!=='string'||!m.name.trim()||m.name.length>80)throw new Error(`${prefix}: enter a name (up to 80 characters).`);
    if(typeof m.source!=='string'||m.source.length>200||!['manual','packet','ocr','unknown'].includes(m.precision))throw new Error(`${prefix}: invalid source metadata.`);
    for(const value of [m.baseSPD,m.panelSPD,m.buffPercent,m.flatBuff,m.advance])if(typeof value!=='number'||!Number.isFinite(value)||Math.abs(value)>1000000)throw new Error(`${prefix}: values must be finite and within ±1,000,000.`);
    if(m.baseSPD<=0||m.panelSPD<=0||effectiveSPD(m)<=0)throw new Error(`${prefix}: base, panel and effective SPD must be positive.`);
    if(m.advance<0||m.advance>100)throw new Error(`${prefix}: initial advance must be 0–100%.`);
  }
}
export function simulateSpeed(team:SpeedTeam){
  validateTeam(team);const horizon=cycleEnd(team.cycles);const events:SpeedEvent[]=[];
  const members=team.members.map(m=>{const speed=effectiveSPD(m);const interval=10000/speed;if(!Number.isFinite(interval)||interval<=0)throw new Error('SPD is outside the supported numeric range.');const first=interval*(1-m.advance/100);const turns=first>horizon+AV_EPSILON?0:Math.max(0,Math.floor((horizon+AV_EPSILON-first)/interval)+1);return {speed,interval,first,turns};});
  if(members.reduce((sum,m)=>sum+m.turns,0)>MAX_EVENTS)throw new Error('Timeline exceeds 2,000 actions. Reduce cycles or SPD; no truncated result is shown.');
  members.forEach((m,member)=>{for(let turn=1;turn<=m.turns;turn++){const av=m.first+(turn-1)*m.interval;const cycle=av<=150+AV_EPSILON?0:Math.ceil((av-150-AV_EPSILON)/100);events.push({member,turn,av,cycle:Math.min(team.cycles-1,cycle)});}});
  events.sort((a,b)=>a.av-b.av||a.member-b.member||a.turn-b.turn);
  const counts=Array.from({length:team.cycles},()=>[0,0,0,0]);for(const event of events)counts[event.cycle][event.member]++;
  return {events,counts,members,horizon};
}
